import Image from "next/image";

export default function Header() {
  return (
    <header className="flex gap-4">
      <Image src="/logo.svg" alt="RITM logo" width={48} height={48} />
      <h1 className="header-element">RITM</h1>
    </header>
  );
}
