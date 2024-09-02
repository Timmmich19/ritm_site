import Image from "next/image";
import { hairs } from "@/app/api/hairList";
import Icon from "@mdi/react";
import { mdiArrowLeftDropCircle, mdiArrowRightDropCircle } from "@mdi/js";
export default function HaircutsList() {
  const arrowProps = "hidden md:block";

  return (
    <div className="flex flex-row">
      <button className={arrowProps}>
        <Icon path={mdiArrowLeftDropCircle} size={2} />
      </button>
      <div className="flex flex-row gap-4 overflow-hidden">
        {hairs.map((hair) => {
          return (
            <Image
              src={hair.src}
              width={300}
              height={450}
              alt={hair.alt}
              key={hair.id}
              placeholder="data:image/jpg; base64,/hairAlt.jpg"
            />
          );
        })}
      </div>
      <button className={arrowProps}>
        <Icon path={mdiArrowRightDropCircle} size={2} />
      </button>
    </div>
  );
}
