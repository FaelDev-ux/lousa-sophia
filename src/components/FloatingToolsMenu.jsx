import { useMemo, useState } from "react";
import { CHALK_COLORS, DRAWING_TOOLS } from "../constants/drawing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faLightbulb, faXmark } from "@fortawesome/free-solid-svg-icons";

const TOOL_LABELS = {
  pen: "Caneta",
  marker: "Marcador",
  chalk: "Giz",
  eraser: "Borracha",
};

export default function FloatingToolsMenu({
  activeTool,
  onToolChange,
  activeColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  isExplanationOpen,
  onOpenExplanation,
  onCloseExplanation,
  explanationText,
  explanationLoading,
  explanationError,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const activeToolLabel = useMemo(() => {
    return TOOL_LABELS[activeTool] || "Ferramentas";
  }, [activeTool]);

  const displayedText = explanationLoading
  ? "A SophIA está pensando..."
  : explanationError
  ? explanationError
  : explanationText
  ? explanationText
  : "Desenhe algo e confirme para receber uma explicação";

  return (
    <div className="pointer-events-none fixed bottom-4 right-3 z-50 flex flex-col items-end">
      <div
        className={`pointer-events-none mb-3 w-72 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur transition-all duration-200 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Ferramentas</span>
          <span className="text-slate-700">{activeToolLabel}</span>
        </div>

        <div className="mb-3 flex justify-start gap-2">
          {DRAWING_TOOLS.map((tool) => {
            const isActive = tool.id === activeTool;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onToolChange(tool.id)}
                title={tool.tip}
                className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                <span aria-hidden>{tool.emoji}</span>
                <span className="sr-only">{tool.tip}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Cores do giz
        </div>
        <div className="flex flex-wrap justify-start gap-2">
          {CHALK_COLORS.map((color) => {
            const isActive = color.hex === activeColor;
            return (
              <button
                key={color.hex}
                type="button"
                onClick={() => onColorChange(color.hex)}
                title={color.label}
                className={`pointer-events-auto h-8 w-8 rounded-full border transition ${
                  isActive
                    ? "border-slate-900 ring-2 ring-slate-900/30"
                    : "border-slate-200 hover:border-slate-400"
                }`}
                style={{ backgroundColor: color.hex }}
              >
                <span className="sr-only">{color.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Espessura
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs text-slate-500">Fina</span>
          <input
            type="range"
            min="1"
            max="18"
            step="1"
            value={brushSize}
            onChange={(event) => onBrushSizeChange(Number(event.target.value))}
            className="pointer-events-auto h-2 w-full cursor-pointer accent-slate-900"
          />
          <span className="text-xs text-slate-500">Grossa</span>
        </div>
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          onClick={isExplanationOpen ? onCloseExplanation : onOpenExplanation}
          className="flex h-14 cursor-pointer w-14 items-center justify-center rounded-full border border-slate-900 bg-white text-xl text-slate-900 shadow-xl transition hover:-translate-y-0.5"
          aria-expanded={isExplanationOpen}
          aria-label="Abrir explicação"
        >
          {isExplanationOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon className="text-yellow-500" icon={faLightbulb} />}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-14 cursor-pointer w-14 items-center justify-center rounded-full border border-slate-900 bg-slate-900 text-xl text-white shadow-xl transition hover:-translate-y-0.5"
          aria-expanded={isOpen}
          aria-label="Abrir ferramentas"
        >
          {isOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faSliders} />}
        </button>
      </div>

      <div
        className={`pointer-events-none fixed bottom-6 left-1/2 z-40 w-[min(90vw,520px)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur transition-all duration-200 ${
          isExplanationOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex relative items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Explicação da conta
            </h3>
            <p className="mt-1 text-s whitespace-pre-line text-slate-600">{displayedText}</p>
          </div>
          <button
            type="button"
            onClick={onCloseExplanation}
            className="pointer-events-auto rounded-full absolute -top-7 -right-8  cursor-pointer border border-slate-300 px-2 py-0 text-base font-semibold text-white bg-red-500 transition hover:border-slate-500"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
