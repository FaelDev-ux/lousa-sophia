export function dataUrlToFile(dataUrl, fileName = "lousa.png") {
  const [header, base64] = dataUrl.split(",");

  if (!header || !base64) {
    throw new Error("Data URL inválida.");
  }

  const mimeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] || "image/png";

  const binaryString = atob(base64);
  const binaryLength = binaryString.length;
  const bytes = new Uint8Array(binaryLength);

  for (let i = 0; i < binaryLength; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new File([bytes], fileName, { type: mimeType });
}
