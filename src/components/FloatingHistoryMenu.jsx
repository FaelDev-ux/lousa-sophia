import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function FloatingHistoryMenu({ items = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const normalizeExplanation = (text) => {
    if (!text) return text;
    return text
      .replace(/\s*Passo 1:/g, "\nPasso 1:")
      .replace(/\s*Passo 2:/g, "\nPasso 2:")
      .replace(/\s*Resultado:/g, "\nResultado:")
      .trim();
  };

  return (
    <div className="fixed bottom-4 left-3 z-40 flex flex-col items-start">
      <div
        className={`pointer-events-none fixed left-3 top-20 z-40 w-[min(80vw,320px)] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur transition-all duration-200 ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-4 opacity-0"
        }`}
      >
        <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Histórico</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full absolute -top-3 -right-4  cursor-pointer border border-slate-300 px-2 py-0 text-base font-semibold text-white bg-red-500 transition hover:border-slate-500"
          >
            ×
          </button>
        </div>
        {items.length === 0 ? (
          <div className="text-sm text-slate-600">
            Nenhum histórico ainda.
          </div>
        ) : (
          <div className="max-h-80 space-y-3 overflow-y-auto text-sm text-slate-700">
            {items.map((item, index) => (
              <div
                key={`${item.createdAt}-${index}`}
                className="rounded-lg border border-slate-200 bg-white/70 p-2"
              >
                <div className="text-xs font-semibold uppercase text-slate-500">
                  {item.expression}
                </div>
                <div className="mt-1 whitespace-pre-line text-sm text-slate-700">
                  {normalizeExplanation(item.explanation)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer h-14 w-14 items-center justify-center rounded-full border border-slate-900 bg-white text-xl text-slate-900 shadow-xl transition hover:-translate-y-0.5"
        aria-expanded={isOpen}
        aria-label="Abrir histórico"
      >
        {isOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faClockRotateLeft} />}
      </button>
    </div>
  );
}
