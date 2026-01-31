import os
import io
import json
import time
import logging
import random
from typing import Optional, List, Dict, Any, Union, Tuple

import fitz
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pdf_insight_api")

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
MODEL_NAME = "gemini-2.5-flash" 

if not GOOGLE_API_KEY:
    logger.warning("GOOGLE_API_KEY not set in environment variables. AI endpoints will fail.")
else:
    genai.configure(api_key=GOOGLE_API_KEY)

class Entity(BaseModel):
    name: str
    type: str

class AnalysisResponse(BaseModel):
    summary: str
    entities: List[Entity]
    sentiment: Optional[str] = None
    key_points: Optional[List[str]] = None

class TableRow(BaseModel):
    data: Optional[str] = None
    description: Optional[str] = None
    value: Optional[Union[float, str]] = None
    model_config = {"extra": "allow"}

class TableResponse(BaseModel):
    table_data: List[Dict[str, Any]]
    message: Optional[str] = None

class Text2AiRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to be analyzed")
    instruction: Optional[str] = "Summarize and extract entities."
    target_language: Optional[str] = Field(None, description="Target language for output (e.g., 'Portuguese', 'en'). Defaults to document language.")

app = FastAPI(
    title="PDF Insight Extractor Pro",
    description="Professional Modular API for single-page PDF extraction and enrichment.",
    version="1.1.3",
    root_path="/default"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

handler = Mangum(app)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    try:
        response = await call_next(request)
        process_time = time.perf_counter() - start_time
        response.headers["X-Process-Time"] = f"{process_time:.4f}"
        return response
    except Exception as e:
        process_time = time.perf_counter() - start_time
        logger.error(f"Unhandled Middleware Exception: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Server Error",
                "detail": str(e),
                "latency_seconds": round(process_time, 4)
            }
        )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": "An unexpected error occurred."}
    )

def validate_one_page_pdf(pdf_bytes: bytes) -> fitz.Document:
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception as e:
        logger.error(f"Invalid PDF file: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid PDF file provided. Could not open stream."
        )

    if len(doc) != 1:
        doc.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Strict Limit: Request payload must contain exactly 1 page. The provided PDF has {len(doc)} pages. Please slice the PDF client-side before sending."
        )
    
    return doc

def get_page_image(doc: fitz.Document) -> Image.Image:
    try:
        page = doc.load_page(0)
        pix = page.get_pixmap(dpi=200)
        img = Image.open(io.BytesIO(pix.tobytes()))
        return img
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image conversion failed: {str(e)}")

def extract_text_smart(doc: fitz.Document) -> Tuple[str, str]:
    try:
        page = doc.load_page(0)
        native_text = page.get_text()
        
        if len(native_text.strip()) < 50 and GOOGLE_API_KEY:
            logger.info("Text layer empty or sparse. Triggering AI Vision OCR.")
            img = get_page_image(doc)
            model = genai.GenerativeModel(MODEL_NAME)
            
            response_text = None
            for attempt in range(3):
                try:
                    response = model.generate_content([
                        "Transcribe all text from this image exactly as is. Do not summarize.", 
                        img
                    ])
                    response_text = response.text
                    break
                except google_exceptions.ResourceExhausted:
                     time.sleep(2 * (attempt + 1))
            
            if response_text:
                return response_text, "AI Vision OCR"
            else:
                 return native_text, "Native (AI Limit Hit)"
        
        return native_text, "Native"
    except Exception as e:
        logger.error(f"Text extraction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

def generate_ai_content(prompt: str, image: Optional[Image.Image] = None, response_schema: Any = None) -> Dict[str, Any]:
    if not GOOGLE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="AI service is not configured (Missing API Key)."
        )

    MAX_RETRIES = 3
    BASE_DELAY = 2

    generation_config = genai.types.GenerationConfig(
        response_mime_type="application/json"
    )
    model = genai.GenerativeModel(MODEL_NAME, generation_config=generation_config)
    
    inputs = [prompt]
    if image:
        inputs.append(image)

    for attempt in range(MAX_RETRIES + 1):
        try:
            response = model.generate_content(inputs)
            return json.loads(response.text)

        except google_exceptions.ResourceExhausted as e:
            if attempt < MAX_RETRIES:
                sleep_time = BASE_DELAY * (2 ** attempt) + random.uniform(0, 0.5)
                logger.warning(f"AI Quota Exceeded (429). Retrying in {sleep_time:.2f}s... (Attempt {attempt + 1}/{MAX_RETRIES})")
                time.sleep(sleep_time)
                continue
            else:
                logger.error("Max retries reached for AI Quota.")
                raise HTTPException(status_code=429, detail="AI Quota Exceeded. Service is busy, try again later.")
        
        except google_exceptions.InvalidArgument as e:
            raise HTTPException(status_code=400, detail=f"AI Invalid Argument: {str(e)}")
        except json.JSONDecodeError:
            raise HTTPException(status_code=502, detail="AI response was not valid JSON.")
        except Exception as e:
            logger.error(f"AI Generation Error: {e}")
            raise HTTPException(status_code=500, detail=f"AI Processing Error: {str(e)}")

@app.get("/")
def health_check():
    return {
        "status": "online", 
        "service": "PDF Insight Extractor Pro",
        "model": MODEL_NAME,
        "ocr_mode": "Hybrid (Native + AI Vision)",
        "version": "1.1.3"
    }

@app.post("/v1/page2text", status_code=200)
async def page_to_text(
    file: UploadFile = File(...),
    request: Request = None
):
    """
    Extracts text from a SINGLE-PAGE PDF. 
    Uses hybrid method: Native text layer -> Fallback to AI Vision (OCR) if text layer is missing.
    """
    start = time.perf_counter()
    
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
        
    doc = validate_one_page_pdf(content)
    
    extracted_text, method = extract_text_smart(doc)
    
    doc.close()

    latency = round(time.perf_counter() - start, 4)

    return {
        "filename": file.filename,
        "text": extracted_text,
        "extraction_method": method,
        "latency_seconds": latency
    }

@app.post("/v1/text2ai", response_model=AnalysisResponse)
async def text_to_ai(request: Text2AiRequest):
    """
    Analyzes raw text using AI. Returns structured JSON with summary and entities.
    Hybrid Language Logic:
    - Summary/Key Points: Translated to target_language.
    - Entities: Kept in ORIGINAL language.
    """
    start = time.perf_counter()
    
    if request.target_language:
        lang_directive = f"""
        CRITICAL LANGUAGE INSTRUCTION:
        1. 'summary' and 'key_points': Write these in {request.target_language}.
        2. 'entities': Extract names/values EXACTLY as they appear in the original text (Original Language). Do NOT translate entity names.
        """
    else:
        lang_directive = "Output all generated values in the same language as the input text."

    prompt = f"""
    Analyze the following text.
    Instruction: {request.instruction}
    
    {lang_directive}
    IMPORTANT: Keep all JSON keys strictly in English (e.g., "summary", "entities").
    
    Return a JSON object with:
    - "summary": A concise summary.
    - "entities": A list of objects {{ "name": "...", "type": "PERSON/ORG/LOC/DATE/MONEY/PHONE/URL" }}.
      * FILTER RULES: Extract ONLY Person Names, Organizations, Locations, Full Dates (written or numeric), Monetary Values, Phone Numbers, and URLs.
      * IGNORE: Reference numbers (e.g., "1.2.3", "6.14.12"), page numbers, clause numbers, isolated integers, or generic nouns.
    - "sentiment": "Positive", "Neutral", or "Negative".

    Text:
    {request.text[:15000]}
    """
    
    ai_data = generate_ai_content(prompt, response_schema=AnalysisResponse)
    
    return ai_data 

@app.post("/v1/page2ai")
async def page_to_ai(
    file: UploadFile = File(...),
    metadata_page_number: int = Form(1, description="Original page number for metadata reference"),
    target_language: Optional[str] = Form(None, description="Target language for output. If None, uses document language.")
):
    """
    Analyzes a SINGLE-PAGE PDF directly. 
    Hybrid Language Logic:
    - Summary/Key Points: Translated to target_language.
    - Entities: Kept in ORIGINAL language.
    """
    start = time.perf_counter()
    
    content = await file.read()
    doc = validate_one_page_pdf(content)
    
    raw_text, _ = extract_text_smart(doc)
    
    if target_language:
        lang_directive = f"""
        CRITICAL LANGUAGE INSTRUCTION:
        1. 'page_summary' and 'key_points': Write these in {target_language}.
        2. 'entities': Extract names/values EXACTLY as they appear in the document (Original Language). Do NOT translate entity names.
        """
    else:
        lang_directive = "Output all generated values in the same language as the document text."

    prompt = f"""
    Analyze the content extracted from a document page (Page Ref: {metadata_page_number}).
    
    {lang_directive}
    IMPORTANT: Keep all JSON keys strictly in English (e.g., "page_summary", "key_points").
    
    Return a JSON with:
    - "page_summary": Concise summary of this specific page.
    - "key_points": A list of bullet points.
    - "entities": List of named entities found {{ "name": "...", "type": "..." }}.
      * FILTER RULES: Extract ONLY Person Names, Organizations, Locations, Full Dates (written or numeric), Monetary Values, Phone Numbers, and URLs.
      * IGNORE: Reference numbers (e.g., "1.2.3", "6.14.12"), page numbers, clause numbers, isolated integers, or generic nouns.
    
    Text Content:
    {raw_text[:10000]}
    """
    
    img = None
    if len(raw_text) < 100:
        img = get_page_image(doc)
        prompt = f"""
        Analyze this document page image (Page Ref: {metadata_page_number}). 
        Return JSON with page_summary, key_points, entities. 
        {lang_directive} 
        IMPORTANT: Keep JSON keys in English.
        ENTITIES RULE: Extract ONLY Names, Orgs, Locs, Dates, Money, Phones, URLs. Ignore reference numbers (like 6.14.12) or simple numbers.
        """

    ai_data = generate_ai_content(prompt, image=img)
    doc.close()
    
    latency = round(time.perf_counter() - start, 4)

    return {
        "filename": file.filename,
        "original_page_ref": metadata_page_number,
        "analysis": ai_data,
        "latency_seconds": latency
    }

@app.post("/v1/page2table")
async def page_to_table(
    file: UploadFile = File(...),
    metadata_page_number: int = Form(1)
):
    """
    Extracts tabular data from a SINGLE-PAGE PDF using AI Vision.
    STRICT RULE: Tables are extracted VERBATIM (Original Language).
    """
    start = time.perf_counter()
    
    content = await file.read()
    doc = validate_one_page_pdf(content)
    img = get_page_image(doc)
    doc.close()
    
    prompt = f"""
    Act as a Data Extraction Specialist.
    Analyze this image. Find the main table.
    
    CRITICAL: Extract table data VERBATIM from the image. 
    1. Do NOT translate the content of the cells. Keep it in the original language of the document.
    2. Maintain exact spelling and formatting of numbers.
    
    Return a JSON Object with a key 'table_data'.
    'table_data' must be a LIST of objects, where each object is a row.
    Normalize headers to snake_case (English keys are fine for headers, but keep values original).
    If no table is found, return {{ "table_data": [], "message": "No table detected" }}.
    """
    
    data = generate_ai_content(prompt, image=img)
    
    latency = round(time.perf_counter() - start, 4)

    return {
        "filename": file.filename,
        "original_page_ref": metadata_page_number,
        "extraction": data,
        "latency_seconds": latency
    }