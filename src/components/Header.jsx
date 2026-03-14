import logo from "../assets/images/logo.png";
import SophiaBar from "./SophiaBar";
import Button from "./Button";

export default function Header({ onClear }) {
  return (
    <header className="w-full bg-gray-50 gap-4 px-4 flex items-center justify-between self-start">
      <img className="max-w-30" src={logo} alt="logo Sophia" />
      <SophiaBar />
      <Button type="delete" text="Limpar" onClick={onClear}/>
    </header>
  );
}
