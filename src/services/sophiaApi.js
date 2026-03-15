const API_BASE_URL = "http://127.0.0.1:8000";

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
