import { forwardRef, useMemo, useRef, useImperativeHandle } from "react";
import CanvasDraw from "react-canvas-draw";

const TOOL_PRESETS = {
  pen: { brushRadius: 2, lazyRadius: 0 },
  marker: { brushRadius: 6, lazyRadius: 0 },
  chalk: { brushRadius: 4, lazyRadius: 1 },
  eraser: { brushRadius: 12, lazyRadius: 0 },
};

const CANVAS_BACKGROUND = "#ffffff";

const Canvas = forwardRef(function Canvas(
  { activeTool, activeColor, brushSize },
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
      loadTimeOffset: 5,
      lazyRadius: toolPreset.lazyRadius,
      brushRadius: resolvedBrushSize,
      brushColor:
        activeTool === "eraser" ? CANVAS_BACKGROUND : activeColor || "#000",
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
