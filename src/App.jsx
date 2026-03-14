import { useRef } from "react";
import Header from "./components/Header";
import Canvas from "./components/Canvas";


function App() {
  const canvasRef = useRef(null);

  const handleClear = () => {
    canvasRef.current?.clear();
  };

  return (
    <div className="h-screen w-screen p-1 flex justify-start flex-col items-center">
      <Header onClear={handleClear} />
      <Canvas ref={canvasRef}/>
    </div>
  );
}

export default App;
