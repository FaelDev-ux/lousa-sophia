export default function Button({ type = "confirm", text }) {
  const bgColor = {
    confirm: "bg-green",
    edit: "bg-amber-200",
    delete: "bg-red-400",
  };

  return <button className={`${bgColor[type]} px-3 py-2 cursor-pointer m-2 rounded-[20px]`}>{text}</button>;
}
