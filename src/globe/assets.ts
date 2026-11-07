import { RAD, xyz } from "./camera";
import { exhibits } from "@/data/exhibits";
export type Pixels = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};
export type Tree = {
  x: number;
  y: number;
  z: number;
  size: number;
  kind: number;
};
export type Assets = Awaited<ReturnType<typeof load>>;
function image(path: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("无法读取星球素材"));
    img.src = "/atlas/" + path;
  });
}
function pixels(img: HTMLImageElement): Pixels {
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, c.width, c.height);
}
export function lookup(map: Pixels, lat: number, lon: number) {
  const u = ((lon / (Math.PI * 2) + .5) % 1 + 1) % 1;
  const v = Math.max(0, Math.min(1, .5 - lat / Math.PI));
  return 4 * (Math.round(v * (map.height - 1)) * map.width + Math.floor(u * map.width));
}
export function altitude(map: Pixels, lat: number, lon: number) {
  return map.data[lookup(map, lat, lon)] / 255 * .16;
}
function vegetation(map: Pixels): Tree[] {
  let seed = 17283;
  const rand = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 4294967296; };
  const trees: Tree[] = [];
  const stations = exhibits.map(e => xyz(e.latitude * RAD, e.longitude * RAD));
  // Scatter around local groves instead of placing uniformly spaced trees.
  for (let j = 0; j < 4100; j++) {
    const baseLat = Math.asin(rand() * 2 - 1), baseLon = (rand() * 2 - 1) * Math.PI;
    const count = 3 + Math.floor(rand() * 7);
    for (let i = 0; i < count; i++) {
      const lat = baseLat + (rand() - .5) * .084;
      if (Math.abs(lat) > Math.PI * .495)
        continue;
      const lon = baseLon + (rand() - .5) * .084 / Math.max(.18, Math.cos(lat));
      const k = lookup(map, lat, lon), density = map.data[k + 1] / 255, field = map.data[k + 2] / 255;
      if (map.data[k] < 2 || rand() > density * 1.24 + .035)
        continue;
      const [nx, ny, nz] = xyz(lat, lon);
      const nearby = stations.findIndex(([x, y, z]) => nx * x + ny * y + nz * z > .959);
      const f = rand();
      let kind = f < .28 ? 0 : f < .56 ? 1 : f < .79 ? 2 : 7;
      if ((field > .67 && rand() < .66) || (nearby === 2 && rand() < .64))
        kind = 4;
      else if (field < .27 && rand() < .66)
        kind = 3;
      else if (nearby === 1 && rand() < .74)
        kind = 5;
      else if ((nearby === 3 || density < .17) && rand() < .71)
        kind = 6;
      const r = 1 + map.data[k] / 255 * .16;
      trees.push({ x: nx * r, y: ny * r, z: nz * r, size: (.018 + rand() ** 1.4 * .039) * (kind === 6 ? .79 : 1), kind });
    }
  }
  return trees;
}
async function load() {
  const [surface, relief, leaves] = await Promise.all([image("surface.webp"), image("relief.png"), image("vegetation.webp")]);
  const material = pixels(surface), heights = pixels(relief);
  return { surface, material, heights, leaves, trees: vegetation(heights) };
}
let cached: Promise<Assets> | undefined;
export function getAssets() {
  return cached ??= load().catch(error => { cached = undefined; throw error; });
}
