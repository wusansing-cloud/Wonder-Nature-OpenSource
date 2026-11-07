// Orthographic camera. Longitude grows eastward, latitude grows northward.
export const RAD = Math.PI / 180;
export type Camera = {
  lon: number;
  lat: number;
  zoom: number;
};
export const HOME: Camera = { lon: 108 * RAD, lat: 19 * RAD, zoom: 1 };
export function clamp(v: number, low: number, high: number) {
  return Math.max(low, Math.min(high, v));
}
export function xyz(lat: number, lon: number, radius = 1): [
  number,
  number,
  number
] {
  const a = Math.cos(lat) * radius;
  return [a * Math.sin(lon), Math.sin(lat) * radius, a * Math.cos(lon)];
}
export function basis(cam: Camera) {
  return [Math.cos(cam.lon), Math.sin(cam.lon), Math.cos(cam.lat), Math.sin(cam.lat)] as const;
}
export function project(x: number, y: number, z: number, [cl, sl, cp, sp]: ReturnType<typeof basis>) {
  const d = x * sl + z * cl;
  return [x * cl - z * sl, y * cp - d * sp, d * cp + y * sp];
}
