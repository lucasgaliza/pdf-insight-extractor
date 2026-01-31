import requests
import fitz
import json
import time
import os

API_URL = "https://wmi1oslfjf.execute-api.sa-east-1.amazonaws.com/default" 

PDF_PATH = "edital-concurso-pf-2025.pdf"     

OUTPUT_FILE = "api_full_dump.md"

PAGES_TO_TEST = [25, 26] 

def save_to_log(title, data):
    with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
        f.write(f"\n## {title}\n")
        f.write("```json\n")
        f.write(json.dumps(data, indent=2, ensure_ascii=False))
        f.write("\n```\n")
        f.write("---\n")

def test_pipeline():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(f"# Log de Teste Otimizado (Slicing Local)\n")
        f.write(f"**Data:** {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"**Arquivo Original:** {PDF_PATH}\n\n")

    if not os.path.exists(PDF_PATH):
        print(f"❌ Erro: '{PDF_PATH}' não encontrado.")
        return

    print(f"--- Iniciando Teste Otimizado com: {PDF_PATH} ---\n")
    
    try:
        doc_original = fitz.open(PDF_PATH)
        total_pages = len(doc_original)
        print(f"📂 Documento carregado. Total: {total_pages} páginas.")
    except Exception as e:
        print(f"❌ Erro ao abrir PDF: {e}")
        return

    for original_page_num in PAGES_TO_TEST:
        if original_page_num > total_pages:
            continue

        print(f"\n>>> Processando PÁGINA REAL {original_page_num} <<<")
        
        try:
            temp_doc = fitz.open()
            temp_doc.insert_pdf(doc_original, from_page=original_page_num-1, to_page=original_page_num-1)
            pdf_bytes = temp_doc.tobytes()
            temp_doc.close()
            
            data_payload = {'page_number': 1}
            files_payload = {'file': ('page_slice.pdf', pdf_bytes, 'application/pdf')}
            
        except Exception as e:
            print(f"❌ Erro ao fatiar PDF localmente: {e}")
            continue

        print(f"1. [POST] /v1/page2text...", end=" ")
        extracted_text = ""
        try:
            files_send = {'file': ('page_slice.pdf', pdf_bytes, 'application/pdf')}
            r = requests.post(f"{API_URL}/v1/page2text", files=files_send, data=data_payload)
            
            if r.status_code == 200:
                print("✅ Sucesso!")
                resp = r.json()
                resp['_meta_pagina_real'] = original_page_num
                save_to_log(f"Pág {original_page_num} - page2text", resp)
                extracted_text = resp.get('text', '')
            else:
                print(f"❌ {r.status_code}")
                save_to_log(f"Pág {original_page_num} - page2text (ERRO)", {"status": r.status_code, "msg": r.text})
        except Exception as e:
            print(f"❌ Erro: {e}")

        print(f"2. [POST] /v1/text2ai...", end=" ")
        if extracted_text and len(extracted_text) > 20:
            payload = {
                "text": extracted_text,
                "instruction": "Extraia as principais informações."
            }
            try:
                r = requests.post(f"{API_URL}/v1/text2ai", json=payload)
                if r.status_code == 200:
                    print("✅ Sucesso!")
                    save_to_log(f"Pág {original_page_num} - text2ai", r.json())
                else:
                    print(f"❌ {r.status_code}")
            except Exception as e:
                print(f"❌ Erro: {e}")
        else:
            print("⚠️ Pulo (Texto vazio).")

        print(f"3. [POST] /v1/page2ai...", end=" ")
        try:
            files_send = {'file': ('page_slice.pdf', pdf_bytes, 'application/pdf')}
            r = requests.post(f"{API_URL}/v1/page2ai", files=files_send, data=data_payload)
            
            if r.status_code == 200:
                print("✅ Sucesso!")
                save_to_log(f"Pág {original_page_num} - page2ai", r.json())
            else:
                print(f"❌ {r.status_code}")
        except Exception as e:
            print(f"❌ Erro: {e}")

        print(f"4. [POST] /v1/page2table...", end=" ")
        try:
            files_send = {'file': ('page_slice.pdf', pdf_bytes, 'application/pdf')}
            r = requests.post(f"{API_URL}/v1/page2table", files=files_send, data=data_payload)
            
            if r.status_code == 200:
                print("✅ Sucesso!")
                save_to_log(f"Pág {original_page_num} - page2table", r.json())
            else:
                print(f"❌ {r.status_code}")
        except Exception as e:
            print(f"❌ Erro: {e}")

        time.sleep(5)

    print(f"\n--- Fim. Veja 'api_full_dump.md' ---")

if __name__ == "__main__":
    test_pipeline()