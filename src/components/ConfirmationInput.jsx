export default function ConfirmationInput({ value, onChange}) {
  return (
    <input
      className="w-full outline-0 min-w-0 text-sm placeholder:text-gray-400 text-gray-800 bg-transparent border-0"
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Digite ou corrija a expressão"
      name=""
      id=""
    />
  );
}
