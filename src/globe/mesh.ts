import { altitude, type Pixels } from "./assets";
import { xyz } from "./camera";
export function buildMesh(heights: Pixels, cols: number, rows: number) {
  const vertices = new Float32Array((cols + 1) * (rows + 1) * 5), indices = new Uint16Array(cols * rows * 6);
  let k = 0, ix = 0;
  for (let j = 0; j <= rows; j++)
    for (let i = 0; i <= cols; i++) {
      const u = i / cols, v = j / rows, lat = (.5 - v) * Math.PI, lon = (u - .5) * Math.PI * 2;
      vertices.set([...xyz(lat, lon, 1 + altitude(heights, lat, lon)), u, v], k);
      k += 5;
      if (i < cols && j < rows) {
        const a = j * (cols + 1) + i, b = a + cols + 1;
        indices.set([a, b, a + 1, b, b + 1, a + 1], ix);
        ix += 6;
      }
    }
  // Accumulate actual terrain face normals instead of lighting every slope as a sphere.
  const normals = new Float32Array((cols + 1) * (rows + 1) * 3);
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i], b = indices[i + 1], c = indices[i + 2];
    const ax = vertices[a * 5], ay = vertices[a * 5 + 1], az = vertices[a * 5 + 2];
    const ux = vertices[b * 5] - ax, uy = vertices[b * 5 + 1] - ay, uz = vertices[b * 5 + 2] - az;
    const vx = vertices[c * 5] - ax, vy = vertices[c * 5 + 1] - ay, vz = vertices[c * 5 + 2] - az;
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    if (nx * ax + ny * ay + nz * az < 0) { nx = -nx; ny = -ny; nz = -nz; }
    for (const n of [a, b, c]) { normals[n * 3] += nx; normals[n * 3 + 1] += ny; normals[n * 3 + 2] += nz; }
  }
  for (let j = 0; j <= rows; j++) {
    const a = j * (cols + 1), b = a + cols;
    for (let k = 0; k < 3; k++) normals[a * 3 + k] = normals[b * 3 + k] = normals[a * 3 + k] + normals[b * 3 + k];
  }
  for (let i = 0; i < normals.length; i += 3) {
    const len = Math.hypot(normals[i], normals[i + 1], normals[i + 2]);
    if (len > 1e-9) { normals[i] /= len; normals[i + 1] /= len; normals[i + 2] /= len; }
    else { const v = i / 3 * 5; const radius = Math.hypot(vertices[v], vertices[v + 1], vertices[v + 2]); normals[i] = vertices[v] / radius; normals[i + 1] = vertices[v + 1] / radius; normals[i + 2] = vertices[v + 2] / radius; }
  }
  return { vertices, indices, normals };
}
