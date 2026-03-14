import CanvasDraw from "react-canvas-draw";

const configCanvas = {
    onChange: null,
    loadTimeOffset: 5,
    lazyRadius: 0,
    brushRadius: 1,
    brushColor: "#000",
    catenaryColor: "transparent",
    hideGridX: true,
    hideGridY: true,
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


export default function Canvas() {
  return (<CanvasDraw {...configCanvas}/>);
}
