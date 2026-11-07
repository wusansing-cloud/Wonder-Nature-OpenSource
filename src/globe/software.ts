// Orthographic, textured triangle rasterizer. It uses a depth buffer so peaks,
// coastlines and vegetation remain attached even on a device without WebGL.
import type { Assets } from "./assets";
import { basis, type Camera } from "./camera";
import { buildMesh } from "./mesh";
export function software(canvas: HTMLCanvasElement, assets: Assets) {
  const ctx = canvas.getContext("2d")!, tile = document.createElement("canvas"), paint = tile.getContext("2d")!;
  const { vertices, indices, normals } = buildMesh(assets.heights, 192, 96);
  const screen = new Float32Array(vertices.length); // x, y, depth, diffuse, rim
  let zbuf = new Float32Array(0), frame: ImageData, scale = 1, size = 0;
  const { data: albedo, width: mw, height: mh } = assets.material;
  return {
    mode: "canvas",
    depthAt(x: number, y: number) {
      const px = Math.round(size * .5 + scale * x), py = Math.round(size * .5 - scale * y);
      return px >= 0 && px < size && py >= 0 && py < size ? zbuf[py * size + px] : -1;
    },
    draw(camera: Camera, width: number, height: number, radius: number, centerX: number) {
      const res = Math.min(620, Math.max(200, Math.ceil(radius * 2.24)));
      if (res !== size) {
        size = res;
        tile.width = tile.height = res;
        frame = paint.createImageData(res, res);
        zbuf = new Float32Array(res * res);
      }
      scale = res / 2.28;
      zbuf.fill(-2);
      frame.data.fill(0);
      const [cl, sl, cp, sp] = basis(camera);
      for (let i = 0; i < vertices.length; i += 5) {
        const wx = vertices[i], wy = vertices[i + 1], wz = vertices[i + 2];
        const d = wx * sl + wz * cl, x = wx * cl - wz * sl, y = wy * cp - d * sp, z = d * cp + wy * sp;
        const length = Math.hypot(x, y, z), ni = i / 5 * 3;
        const nd = normals[ni] * sl + normals[ni + 2] * cl;
        const nx = normals[ni] * cl - normals[ni + 2] * sl, ny = normals[ni + 1] * cp - nd * sp, nz = nd * cp + normals[ni + 1] * sp;
        const light = (-nx * .58 + ny * .72 + nz * .67) / 1.142;
        screen[i] = size * .5 + x * scale;
        screen[i + 1] = size * .5 - y * scale;
        screen[i + 2] = z;
        screen[i + 3] = .43 + .81 * Math.max(-.21, light);
        screen[i + 4] = (1 - Math.max(z / length, 0)) ** 3.6 * (.26 + .74 * Math.max(0, light));
      }
      const out = frame.data;
      for (let k = 0; k < indices.length; k += 3) {
        const a = indices[k] * 5, b = indices[k + 1] * 5, c = indices[k + 2] * 5;
        if (screen[a + 2] < -.18 && screen[b + 2] < -.18 && screen[c + 2] < -.18)
          continue;
        const ax = screen[a], ay = screen[a + 1], bx = screen[b], by = screen[b + 1], cx = screen[c], cy = screen[c + 1];
        const bx0 = bx - ax, by0 = by - ay, cx0 = cx - ax, cy0 = cy - ay, area = bx0 * cy0 - by0 * cx0;
        if (area >= -.0001)
          continue;
        const minX = Math.max(0, Math.ceil(Math.min(ax, bx, cx) - .5)), maxX = Math.min(size - 1, Math.floor(Math.max(ax, bx, cx) - .5));
        const minY = Math.max(0, Math.ceil(Math.min(ay, by, cy) - .5)), maxY = Math.min(size - 1, Math.floor(Math.max(ay, by, cy) - .5));
        const u0 = vertices[a + 3], v0 = vertices[a + 4], ub = vertices[b + 3] - u0, uc = vertices[c + 3] - u0, vb = vertices[b + 4] - v0, vc = vertices[c + 4] - v0;
        for (let y = minY; y <= maxY; y++)
          for (let x = minX; x <= maxX; x++) {
            const rx = x + .5 - ax, ry = y + .5 - ay, s = (rx * cy0 - ry * cx0) / area, t = (bx0 * ry - by0 * rx) / area;
            if (s < -.0001 || t < -.0001 || s + t > 1.0001)
              continue;
            const m = 1 - s - t, z = m * screen[a + 2] + s * screen[b + 2] + t * screen[c + 2], p = y * size + x;
            if (z <= zbuf[p])
              continue;
            zbuf[p] = z;
            const u = Math.min(mw - 1, Math.max(0, Math.floor((u0 + s * ub + t * uc) * mw)));
            const v = Math.min(mh - 1, Math.max(0, Math.round((v0 + s * vb + t * vc) * (mh - 1))));
            const off = (v * mw + u) * 4, diff = m * screen[a + 3] + s * screen[b + 3] + t * screen[c + 3];
            const rim = m * screen[a + 4] + s * screen[b + 4] + t * screen[c + 4], j = p * 4;
            out[j] = albedo[off] * diff + 82 * rim + 2;
            out[j + 1] = albedo[off + 1] * diff + 115 * rim + 4;
            out[j + 2] = albedo[off + 2] * diff + 59 * rim + 5;
            out[j + 3] = 255;
          }
      }
      paint.putImageData(frame, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const extent = radius * 2.28;
      ctx.drawImage(tile, (centerX - extent * .5) * canvas.width / width, (height - extent) * .5 * canvas.height / height, extent * canvas.width / width, extent * canvas.height / height);
    },
    dispose() { tile.width = tile.height = 0; }
  };
}
