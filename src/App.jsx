import { useRef, useState } from "react";
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import FloatingToolsMenu from "./components/FloatingToolsMenu";
import { CHALK_COLORS } from "./constants/drawing";


function App() {
  const canvasRef = useRef(null);
  const [activeTool, setActiveTool] = useState("pen");
  const [activeColor, setActiveColor] = useState(CHALK_COLORS[0]?.hex || "#000");
  const [brushSize, setBrushSize] = useState(4);

  const handleClear = () => {
    canvasRef.current?.clear();
  };

  return (
    <div className="h-screen w-screen p-1 flex justify-start flex-col items-center">
      <Header onClear={handleClear} />
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
