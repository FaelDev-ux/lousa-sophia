from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SophIA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], ### Colocar a rota url do react aqui
    allow_credentials=True,
    allow_methods=["*"], #### metodos crud
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "A SophIA está online!"}

@app.post("/api/transcribe")
async def transcribe_image(file: UploadFile = File(...)):
    return {   ###### aqui vai ser a IA
        "success": True,
        "transcription": "√7 / 7",
        "message": "A SophIA entendeu a sua imagem."
    }

@app.post("/api/analyze")
async def analyze_math(expression: dict):
    texto_recebido = expression.get("math_text", "")
    return {
        "success": True,
        "explanation": f"A expressão {texto_recebido} foi resolvida com sucesso.",
    }