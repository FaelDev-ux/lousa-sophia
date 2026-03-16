import { useEffect, useRef, useState } from "react";

import { dataUrlToFile } from "./utils/image";
import { analyzeMath, transcribeImage } from "./services/sophiaApi";
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import FloatingToolsMenu from "./components/FloatingToolsMenu";
import FloatingHistoryMenu from "./components/FloatingHistoryMenu";
import { CHALK_COLORS } from "./constants/drawing";


function App() {
  const canvasRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [expression, setExpression] = useState("");
  const [activeTool, setActiveTool] = useState("pen");
  const [activeColor, setActiveColor] = useState(CHALK_COLORS[0]?.hex || "#000");
  const [brushSize, setBrushSize] = useState(4);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [explanationText, setExplanationText] = useState("");
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState("");
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sophia.history");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setHistoryItems(parsed);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }, []);

  const persistHistory = (updater) => {
    setHistoryItems((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem("sophia.history", JSON.stringify(next));
      } catch (error) {
        console.error("Erro ao salvar histórico:", error);
      }
      return next;
    });
  };

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

  const handleExplain = async () => {
    setIsExplanationOpen(true);
    setExplanationLoading(true);
    setExplanationError("");
    setExplanationText("");

    try {
      let mathText = expression.trim();

      if (!mathText) {
        const pngDataUrl = canvasRef.current?.getPngDataUrl();
        if (!pngDataUrl) {
          throw new Error("Não foi possível capturar a imagem da lousa.");
        }

        const pngFile = dataUrlToFile(pngDataUrl, "lousa.png");
        const result = await transcribeImage(pngFile);
        mathText = result?.transcription?.trim() || "";
      }

      if (!mathText) {
        throw new Error("Não encontrei nenhuma conta para explicar.");
      }

      const analysis = await analyzeMath(mathText);
      const explanation =
        analysis?.explanation || "Sem explicação disponível.";
      setExplanationText(explanation);

      const newEntry = {
        expression: mathText,
        explanation,
        createdAt: new Date().toISOString(),
      };
      persistHistory((prev) => [newEntry, ...prev].slice(0, 20));
    } catch (error) {
      console.error(error);
      const normalizedMessage =
        error?.message?.toLowerCase?.().includes("failed to fetch")
          ? "Escreva novamente."
          : error?.message;
      setExplanationError(
        normalizedMessage ||
          "Não foi possível gerar a explicação agora. Tente novamente."
      );
    } finally {
      setExplanationLoading(false);
    }
  };

  const handleToggleExplanation = () => {
    if (isExplanationOpen) {
      setIsExplanationOpen(false);
      return;
    }

    handleExplain();
  };

  return (
    <div className="h-screen w-screen p-1 flex justify-start flex-col items-center">
      <Header
        onClear={handleClear}
        onReadCanvas={handleReadCanvas}
        status={status}
        expression={expression}
        onToggleExplanation={handleToggleExplanation}
        onExpressionChange={setExpression}
      />
      <Canvas
        ref={canvasRef}
        activeTool={activeTool}
        activeColor={activeColor}
        brushSize={brushSize}
      />
      <FloatingHistoryMenu items={historyItems} />
      <FloatingToolsMenu
        activeTool={activeTool}
        onToolChange={setActiveTool}
        activeColor={activeColor}
        onColorChange={setActiveColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        isExplanationOpen={isExplanationOpen}
        onOpenExplanation={() => setIsExplanationOpen(true)}
        onCloseExplanation={() => setIsExplanationOpen(false)}
        explanationText={explanationText}
        explanationLoading={explanationLoading}
        explanationError={explanationError}
      />
    </div>
  );
}

export default App;
