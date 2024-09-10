import { Hairs } from "@/app/api/interfaces";

const hairs: Hairs[] = [];

for (let i = 0; i < 20; i += 1) {
  hairs.push({
    src: "/hair.png",
    alt: `hair#${i + 1}`,
  });
}

export default hairs;
