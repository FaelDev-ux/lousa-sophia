import os
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image


# 1. Carrega as variáveis de ambiente (a sua chave do .env)
load_dotenv()

# 2. Configura a IA do Google com a sua chave
chave_api = os.getenv("GEMINI_API_KEY")
if not chave_api:
    raise ValueError("A chave GEMINI_API_KEY não foi encontrada no arquivo .env!")

genai.configure(api_key=chave_api)

# Usamos o modelo Flash, que é excelente para ler imagens (Visão) e textos rápidos
modelo_ia = genai.GenerativeModel('gemini-1.5-flash')

# 3. Inicializa o app FastAPI
app = FastAPI(title="SophIA API", description="API para a lousa inteligente SophIA")

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "A SophIA está online e conectada ao Gemini!"}

# --- ROTA 1: Ler a imagem da lousa ---
@app.post("/api/transcribe")
async def transcribe_image(file: UploadFile = File(...)):
    try:
        # Lê os bytes da imagem enviada pelo front-end
        conteudo_imagem = await file.read()
        
        # Converte para o formato que a IA entende usando o Pillow (PIL)
        imagem_pil = Image.open(io.BytesIO(conteudo_imagem))
        
        # Prompt: As instruções exatas do que a IA deve fazer com a imagem
        prompt = "Você é um leitor de equações. Leia a imagem e me devolva APENAS o texto da equação matemática ou expressão que está escrita nela. Não adicione nenhuma formatação, aspas ou texto extra, apenas a matemática."
        
        # Pede para o Gemini analisar a imagem junto com o prompt
        resposta = modelo_ia.generate_content([prompt, imagem_pil])
        
        # Pega o texto gerado pela IA e remove espaços em branco extras
        transcricao = resposta.text.strip()
        
        return {
            "success": True,
            "transcription": transcricao,
            "message": "Imagem lida com sucesso pela IA."
        }
        
    except Exception as e:
        print(f"Erro ao ler imagem: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao processar a imagem com a IA.")

# --- ROTA 2: Resolver a equação ---
@app.post("/api/analyze")
async def analyze_math(expression: dict):
    try:
        texto_recebido = expression.get("math_text", "")
        
        if not texto_recebido:
            raise HTTPException(status_code=400, detail="Nenhuma expressão matemática foi enviada.")
        
        # Prompt: Como a SophIA deve agir como professora
        prompt = f"Você é a SophIA, uma professora de matemática amigável e didática. Resolva a seguinte expressão ou equação matemática passo a passo, explicando de forma clara e simples para um aluno: {texto_recebido}"
        
        # Envia apenas texto para a IA agora
        resposta = modelo_ia.generate_content(prompt)
        
        explicacao = resposta.text
        
        return {
            "success": True,
            "explanation": explicacao,
        }
        
    except Exception as e:
        print(f"Erro ao analisar matemática: {e}")
        raise HTTPException(status_code=500, detail="Erro ao gerar a explicação matemática.")