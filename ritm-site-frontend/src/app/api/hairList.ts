import { Hairs } from "@/app/api/interfaces";

const hairs: Hairs[] = [];

for (let id = 0; id < 20; id++) {
  hairs.push({
    id,
    src: "/hair.png",
    alt: `hair#${id + 1}`,
  });
}

export { hairs };
