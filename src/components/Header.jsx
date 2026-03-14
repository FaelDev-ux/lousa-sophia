import logo from "../assets/images/logo.png";
import ConfirmationInput from "./ConfirmationInput";
import Button from "./Button";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between self-start">
      <img className="max-w-30" src={logo} alt="logo Sophia" />
      <ConfirmationInput />
      <div>
        <Button type="confirm" text="Confirmar"/>
        <Button type="edit" text="Editar"/>
        <Button type="delete" text="Limpar"/>
      </div>
    </header>
  )
}