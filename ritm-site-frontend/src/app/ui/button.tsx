export default function Button({ name }: { name: string }) {
  return (
    <button
      type="button"
      className="bg-rose-900 rounded p-2 border-solid border-2 border-slate-900"
    >
      {name}
    </button>
  );
}
