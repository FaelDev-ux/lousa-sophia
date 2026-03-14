import { forwardRef, useRef, useImperativeHandle } from "react";
import CanvasDraw from "react-canvas-draw";

const configCanvas = {
  loadTimeOffset: 5,
  lazyRadius: 0,
  brushRadius: 1,
  brushColor: "#000",
  catenaryColor: "transparent",
  hideGridX: true,
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
  disabled: false,
  saveData: null,
  immediateLoading: false,
  hideInterface: false,
  gridSizeX: 25,
  gridSizeY: 25,
  gridLineWidth: 0.5,
  enablePanAndZoom: true,
  mouseZoomFactor: 0.01,
  zoomExtents: { min: 1, max: 10 },
};

const Canvas = forwardRef(function Canvas(_, ref) {
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    clear: () => canvasRef.current?.clear(),
  }));

  return <CanvasDraw ref={canvasRef} {...configCanvas} />;
});

export default Canvas;
