import ConfirmationInput from "./ConfirmationInput";
import Button from "./Button";

export default function SophiaBar({
  status,
  expression,
  onExpressionChange,
  onToggleExplanation,
}) {
  const isIdle = status === "idle";
  const isThinking = status === "thinking";
  const isUnderstood = status === "understood";
  const isError = status === "error";

  const statusStyles = {
    idle: "border-gray-200 bg-white",
    thinking: "border-blue-200 bg-blue-50",
    understood: "border-green-200 bg-green-50",
    error: "border-red-200 bg-red-50",
  };

  return (
    <div
      className={`flex gap-3 items-center border ${statusStyles[status] || statusStyles.idle} px-3 py-0 rounded-2xl`}
    >
      <span className="text-sm shrink-0 font-medium text-gray-600">
        {isThinking && "Estou interpretando..."}
        {isUnderstood && "Eu entendi: "}
        {isIdle && "Escreva algo para começar..."}
        {isError && "Não consegui entender..."}
      </span>

      {(isUnderstood || isError) && (
        <>
          <ConfirmationInput
            value={expression}
            onChange={(e) => onExpressionChange(e.target.value)}
          />
          <Button onClick={onToggleExplanation} type="confirm" text="Confirmar" />
        </>
      )}
    </div>
  );
}
