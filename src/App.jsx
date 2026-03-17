import { useCallback, useEffect, useRef, useState } from "react";

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
  const autoRecognizeTimeoutRef = useRef(null);
  const autoRecognizeInFlightRef = useRef(false);
  const hasWrittenRef = useRef(false);

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
    if (autoRecognizeTimeoutRef.current) {
      clearTimeout(autoRecognizeTimeoutRef.current);
      autoRecognizeTimeoutRef.current = null;
    }
    hasWrittenRef.current = false;
  };

  const handleReadCanvas = async () => {
    if (autoRecognizeInFlightRef.current) return;
    autoRecognizeInFlightRef.current = true;
    const pngDataUrl = canvasRef.current?.getPngDataUrl();

    if (!pngDataUrl) {
      setStatus("error");
      setExpression("");
      autoRecognizeInFlightRef.current = false;
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
    } finally {
      autoRecognizeInFlightRef.current = false;
    }
  };

  const scheduleAutoRecognize = useCallback(() => {
    hasWrittenRef.current = true;
    if (autoRecognizeTimeoutRef.current) {
      clearTimeout(autoRecognizeTimeoutRef.current);
    }

    autoRecognizeTimeoutRef.current = setTimeout(() => {
      if (hasWrittenRef.current) {
        hasWrittenRef.current = false;
        handleReadCanvas();
      }
    }, 2000);
  }, []);

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
        onCanvasChange={scheduleAutoRecognize}
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
