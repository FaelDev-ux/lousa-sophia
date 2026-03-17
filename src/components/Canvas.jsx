import { forwardRef, useMemo, useRef, useImperativeHandle } from "react";
import CanvasDraw from "react-canvas-draw";

const TOOL_PRESETS = {
  pen: { brushRadius: 2, lazyRadius: 6, opacity: 1 },
  marker: { brushRadius: 8, lazyRadius: 5, opacity: 0.45 },
  chalk: { brushRadius: 5, lazyRadius: 8, opacity: 0.75 },
  eraser: { brushRadius: 12, lazyRadius: 4, opacity: 1 },
};

const CANVAS_BACKGROUND = "#ffffff";

const hexToRgba = (hex, alpha = 1) => {
  if (!hex || typeof hex !== "string") return `rgba(0,0,0,${alpha})`;
  const cleaned = hex.replace("#", "").trim();
  const isShort = cleaned.length === 3;
  const r = parseInt(
    isShort ? cleaned[0] + cleaned[0] : cleaned.slice(0, 2),
    16
  );
  const g = parseInt(
    isShort ? cleaned[1] + cleaned[1] : cleaned.slice(2, 4),
    16
  );
  const b = parseInt(
    isShort ? cleaned[2] + cleaned[2] : cleaned.slice(4, 6),
    16
  );
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(0,0,0,${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Canvas = forwardRef(function Canvas(
  { activeTool, activeColor, brushSize, onCanvasChange },
  ref
) {
  const canvasRef = useRef(null);
  const toolPreset = TOOL_PRESETS[activeTool] || TOOL_PRESETS.pen;
  const resolvedBrushSize = Math.max(
    1,
    Number.isFinite(brushSize) ? brushSize : toolPreset.brushRadius
  );

  const configCanvas = useMemo(
    () => ({
      onChange: onCanvasChange || null,
      loadTimeOffset: 5,
      lazyRadius: toolPreset.lazyRadius,
      brushRadius: resolvedBrushSize,
      brushColor:
        activeTool === "eraser"
          ? CANVAS_BACKGROUND
          : hexToRgba(activeColor || "#000", toolPreset.opacity ?? 1),
      catenaryColor: "transparent",
      hideGrid: true,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
      disabled: false,
      saveData: null,
      immediateLoading: false,
      hideInterface: false,
      gridLineWidth: 0.5,
      enablePanAndZoom: true,
      mouseZoomFactor: 0.01,
      zoomExtents: { min: 1, max: 10 },
      backgroundColor: CANVAS_BACKGROUND,
    }),
    [activeColor, activeTool, resolvedBrushSize, toolPreset]
  );

  useImperativeHandle(ref, () => ({
    clear: () => canvasRef.current?.clear(),
    getCanvasInstance: () => canvasRef.current,
    getPngDataUrl: () => canvasRef.current?.getDataURL("png", false, "#FFF"),
    getSaveData: () => canvasRef.current?.getSaveData(),
  }));

  return <CanvasDraw ref={canvasRef} {...configCanvas} />;
});

export default Canvas;
