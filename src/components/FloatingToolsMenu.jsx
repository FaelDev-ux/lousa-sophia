import { useMemo, useState } from "react";
import { CHALK_COLORS, DRAWING_TOOLS } from "../constants/drawing";

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
}) {
  const [isOpen, setIsOpen] = useState(false);

  const activeToolLabel = useMemo(() => {
    return TOOL_LABELS[activeTool] || "Ferramentas";
  }, [activeTool]);

  return (
    <div className="fixed bottom-4 right-3 z-50 flex flex-col items-end">
      <div
        className={`mb-3 w-72 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur transition-all duration-200 ${
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
                className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition ${
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
                className={`h-8 w-8 rounded-full border transition ${
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
            onChange={(event) =>
              onBrushSizeChange(Number(event.target.value))
            }
            className="h-2 w-full cursor-pointer accent-slate-900"
          />
          <span className="text-xs text-slate-500">Grossa</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-900 bg-slate-900 text-xl text-white shadow-xl transition hover:-translate-y-0.5"
        aria-expanded={isOpen}
        aria-label="Abrir ferramentas"
      >
        {isOpen ? "×" : "✍️"}
      </button>
    </div>
  );
}
