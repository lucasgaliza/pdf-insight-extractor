import os
import io
import json
import fitz
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from mangum import Mangum
import google.generativeai as genai
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel('gemini-2.5-flash')

app = FastAPI(
    title="PDF Insight Extractor",
    description="API Modular para extração e enriquecimento de dados de PDFs.",
    version="0.0.1",
    root_path="/default"
)

handler = Mangum(app)

class Text2AiRequest(BaseModel):
    text: str
    instruction: Optional[str] = "Resuma e extraia entidades."


def get_pdf_page_image(pdf_bytes: bytes, page_number: int) -> Image.Image:
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        if page_number < 1 or page_number > len(doc):
            raise ValueError(f"Página {page_number} inválida. O documento tem {len(doc)} páginas.")
        
        page = doc.load_page(page_number - 1)
        pix = page.get_pixmap(dpi=150)
        img = Image.open(io.BytesIO(pix.tobytes()))
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar PDF: {str(e)}")

def get_pdf_page_text(pdf_bytes: bytes, page_number: int) -> str:
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        if page_number < 1 or page_number > len(doc):
            raise ValueError(f"Página {page_number} inválida. O documento tem {len(doc)} páginas.")
        
        page = doc.load_page(page_number - 1)
        return page.get_text()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao ler PDF: {str(e)}")

def clean_json_response(response_text: str) -> Any:
    text = response_text.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"raw_output": text, "error": "IA não retornou um JSON válido."}


@app.get("/")
def health_check():
    return {"status": "online", "service": "PDF Intelligence Suite"}

@app.post("/v1/page2text")
async def page_to_text(
    page_number: int = Form(...),
    file: UploadFile = File(...)
):

    content = await file.read()
    text = get_pdf_page_text(content, page_number)
    
    return {
        "filename": file.filename,
        "page": page_number,
        "text": text
    }

@app.post("/v1/text2ai")
async def text_to_ai(request: Text2AiRequest):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="API Key não configurada.")

    prompt = f"""
    Analise o texto abaixo. 
    Instrução: {request.instruction}
    
    Retorne APENAS um JSON com o seguinte formato:
    {{
        "summary": "Um resumo conciso do que foi abordado no texto",
        "entities": [{{ "name": "Nome", "type": "PESSOA/EMPRESA/DATA" }}],
        "sentiment": "Positivo/Neutro/Negativo"
    }}

    Texto:
    {request.text[:10000]}
    """
    
    try:
        response = model.generate_content(prompt)
        return clean_json_response(response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/page2ai")
async def page_to_ai(
    page_number: int = Form(...),
    file: UploadFile = File(...)
):

    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="API Key não configurada.")

    content = await file.read()
    raw_text = get_pdf_page_text(content, page_number)

    prompt = f"""
    Analise o texto extraído da página {page_number} do documento {file.filename}.
    
    Retorne APENAS um JSON com:
    {{
        "page_summary": "Resumo conciso do que foi abordado nesta página",
        "key_points": ["Lista de pontos chave"],
        "entities": [{{ "name": "Nome", "type": "PESSOA/EMPRESA/DATA" }}]
    }}

    Texto da página:
    {raw_text[:5000]}
    """
    
    try:
        response = model.generate_content(prompt)
        ai_data = clean_json_response(response.text)
        
        return {
            "filename": file.filename,
            "page": page_number,
            "raw_text_preview": raw_text[:200] + "...",
            "analysis": ai_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/page2table")
async def page_to_table(
    page_number: int = Form(...),
    file: UploadFile = File(...)
):

    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="API Key não configurada.")

    content = await file.read()
    
    img = get_pdf_page_image(content, page_number)

    prompt = """
    Aja como um especialista em OCR e Extração de Dados.
    Analise esta imagem. Se houver uma tabela, extraia os dados.
    
    Regras OBRIGATÓRIAS:
    1. Retorne APENAS um JSON.
    2. O JSON deve conter uma chave 'table_data' que é uma LISTA DE OBJETOS.
    3. Cada objeto representa uma linha da tabela.
    4. As chaves do objeto devem ser os cabeçalhos das colunas (normalize para snake_case).
    5. Se não houver tabela, retorne { "table_data": [], "message": "Nenhuma tabela encontrada" }

    Exemplo de formato esperado:
    {
        "table_data": [
            {"data": "2023-01-01", "descricao": "Pagamento X", "valor": 100.00},
            {"data": "2023-01-02", "descricao": "Recebimento Y", "valor": 500.00}
        ]
    }
    """
    
    try:
        response = model.generate_content([prompt, img])
        data = clean_json_response(response.text)
        
        return {
            "filename": file.filename,
            "page": page_number,
            "extraction": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))