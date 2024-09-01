import Image from "next/image";
import { hairs } from "@/app/api/hairList";

export default function HaircutsList() {
  return (
    <div className="flex flex-row gap-4 overflow-x-auto">
      {hairs.map((hair) => {
        return (
          <Image
            src={hair.src}
            // This both parametrs: with and heigth not work!! Why?
            width={600}
            height={600}
            alt={hair.alt}
            key={hair.src}
            className="w-[400px] h-[600px]"
          />
        );
      })}
    </div>
  );
}
