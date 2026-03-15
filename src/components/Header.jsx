import logo from "../assets/images/logo.png";
import SophiaBar from "./SophiaBar";
import Button from "./Button";

export default function Header({
  onClear,
  status,
  expression,
  onReadCanvas,
  onExpressionChange,
}) {
  return (
    <header className="w-full gap-4 px-4 flex items-center justify-between self-start">
      <img className="max-w-30" src={logo} alt="logo Sophia" />
      <SophiaBar
        status={status}
        expression={expression}
        onExpressionChange={onExpressionChange}
      />

      <Button type="delete" text="Limpar" onClick={onClear} />
      <Button type="delete" text="Ler imagem" onClick={onReadCanvas} />
    </header>
  );
}
