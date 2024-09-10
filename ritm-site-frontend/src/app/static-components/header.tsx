import Image from "next/image";
import { logo } from "@/app/ui/fonts";

export default function Header() {
  return (
    <header>
      <Image
        src="/logo.svg"
        alt="RITM logo"
        width={36}
        height={36}
        className="m-[14px]"
      />
      <h1 className={`${logo.className} text-3xl text-logoText`}>RITM</h1>
    </header>
  );
}
