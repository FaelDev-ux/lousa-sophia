import Header from "./components/Header";
import Canvas from "./components/Canvas";


function App() {
  return (
    <div className="h-screen w-screen p-1 flex justify-start flex-col items-center">
      <Header />
      <Canvas/>
    </div>
  );
}

export default App;
