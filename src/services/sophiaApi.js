const API_BASE_URL = "http://1";

export async function transcribeImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao transcrever a imagem.");
  }

  return data;
}

export async function analyzeMath(mathText) {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ math_text: mathText }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao analisar a expressão.");
  }

  return data;
}
