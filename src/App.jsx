import { useRef, useState } from "react";

import { dataUrlToFile } from "./utils/image";
import { transcribeImage } from "./services/sophiaApi";

import { useRef, useState } from "react";
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import FloatingToolsMenu from "./components/FloatingToolsMenu";
import { CHALK_COLORS } from "./constants/drawing";


function App() {
  const canvasRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [expression, setExpression] = useState("");
  const [activeTool, setActiveTool] = useState("pen");
  const [activeColor, setActiveColor] = useState(CHALK_COLORS[0]?.hex || "#000");
  const [brushSize, setBrushSize] = useState(4);

  const handleClear = () => {
    canvasRef.current?.clear();
    setStatus("idle");
    setExpression("");
  };

  const handleReadCanvas = async () => {
    const pngDataUrl = canvasRef.current?.getPngDataUrl();

    if (!pngDataUrl) {
      setStatus("error");
      setExpression("");
      return;
    }

    try {
      setStatus("thinking");

      const pngFile = dataUrlToFile(pngDataUrl, "lousa.png");

      const result = await transcribeImage(pngFile);
      console.log("RESPOSTA DO BACKEND: ", result);

      const recognizedText = result?.transcription?.trim() || "";

      if (!recognizedText) {
        throw new Error("Sophia não conseguiu interpretar a expressão");
      }

      setExpression(recognizedText);
      setStatus("understood");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setExpression("");
    }
  };

  return (
    <div className="h-screen w-screen p-1 flex justify-start flex-col items-center">
      <Header
        onClear={handleClear}
        onReadCanvas={handleReadCanvas}
        status={status}
        expression={expression}
        onExpressionChange={setExpression}
      />
      <Canvas
        ref={canvasRef}
        activeTool={activeTool}
        activeColor={activeColor}
        brushSize={brushSize}
      />
      <FloatingToolsMenu
        activeTool={activeTool}
        onToolChange={setActiveTool}
        activeColor={activeColor}
        onColorChange={setActiveColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
      />
    </div>
  );
}

export default App;
