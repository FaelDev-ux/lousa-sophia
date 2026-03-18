# 🧠✍️ SophIA - Lousa Inteligente

A **SophIA** é uma aplicação web interativa que funciona como uma lousa digital inteligente. O usuário desenha expressões matemáticas na tela e, através de Inteligência Artificial e Visão Computacional, a aplicação transcreve o desenho em texto e atua como uma professora, explicando a resolução da conta passo a passo.

Este projeto foi desenvolvido utilizando a arquitetura **Monorepo**, separando as responsabilidades de Front-end e Back-end, mas mantendo o código unificado no mesmo repositório.

---

## 🚀 Tecnologias Utilizadas

### 🎨 Front-end
A interface foi construída para ser fluida, responsiva e garantir uma boa experiência de desenho (Canvas):
* **[React](https://reactjs.org/):** Biblioteca principal para a construção da interface do usuário de forma componentizada.
* **[JavaScript (ES6+)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript):** Responsável por toda a lógica de captura do desenho no Canvas, conversão da imagem (Blob) e requisições HTTP (`fetch`) para a API.
* **[Vite](https://vitejs.dev/):** Ferramenta de build extremamente rápida que serve a aplicação no ambiente de desenvolvimento.
* **[Tailwind CSS](https://tailwindcss.com/):** Framework de CSS utilitário usado para estilizar a aplicação de forma moderna e sem a necessidade de arquivos CSS gigantes.

### ⚙️ Back-end
O servidor foi desenhado para ser rápido, moderno e focado na integração com a Inteligência Artificial:
* **[Python 3](https://www.python.org/):** Linguagem base do servidor.
* **[FastAPI](https://fastapi.tiangolo.com/):** Framework web de altíssima performance responsável por criar as rotas da nossa API (`/api/transcribe` e `/api/analyze`).
* **[Uvicorn](https://www.uvicorn.org/):** Servidor ASGI que roda a aplicação FastAPI.
* **[Pillow (PIL)](https://pillow.readthedocs.io/):** Biblioteca para manipulação e conversão dos arquivos de imagem recebidos do Front-end.
* **[Google Gemini API](https://ai.google.dev/):** O "cérebro" do projeto. Utilizamos o modelo **`gemini-2.5-flash`** pela sua velocidade e excelente capacidade de OCR (Visão Computacional) para ler matemática nativamente a partir de imagens.

---

## 💻 Como rodar o projeto localmente

Para rodar a SophIA na sua máquina, você precisará ter o [Node.js](https://nodejs.org/) e o [Python](https://www.python.org/) instalados, além de uma chave de API gratuita do Google Gemini.

### 1. Clone o repositório
```bash
git clone [https://github.com/SEU_USUARIO/lousa-sophia.git](https://github.com/SEU_USUARIO/lousa-sophia.git)
cd lousa-sophia

2. Configurando o Back-end (API e IA)
Abra um terminal e navegue até a pasta do back-end:

Bash
cd backend

Crie e ative um ambiente virtual (Venv):

Bash
# No Windows:
python -m venv venv
.\venv\Scripts\activate

# No Mac/Linux:
python3 -m venv venv
source venv/bin/activate

Bash
pip install -r requirements.txt


Configure a chave da API:

Crie um arquivo chamado .env dentro da pasta backend.

Adicione a sua chave do Google AI Studio neste formato:
GEMINI_API_KEY=sua_chave_aqui

Inicie o servidor local:

Bash
uvicorn main:app --reload
A API estará rodando em http://localhost:8000. Você pode acessar http://localhost:8000/docs para testar as rotas visualmente.

3. Configurando o Front-end (Interface)
Abra um novo terminal (mantenha o do back-end rodando) e certifique-se de estar na pasta raiz do front-end (onde está o package.json).

Instale as dependências do Node:

Bash
npm install

Inicie a aplicação:
Bash
npm run dev

A lousa estará disponível no seu navegador, geralmente no endereço http://localhost:5173.

