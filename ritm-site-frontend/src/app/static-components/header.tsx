import Image from "next/image";

export default function Header() {
  return (
    <header>
      <Image src="/logo.svg" alt="RITM logo" width={48} height={48} />
      <h1>RITM</h1>
    </header>
  );
}
