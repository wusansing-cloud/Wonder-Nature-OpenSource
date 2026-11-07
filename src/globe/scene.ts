import { exhibits } from "@/data/exhibits";
import { altitude, type Assets } from "./assets";
import { HOME, RAD, basis, clamp, project, xyz } from "./camera";
import { makeSurface } from "./terrain";
export type SceneControls = {
  zoomBy(factor: number): void;
  reset(): void;
  visit(id: string): void;
  dispose(): void;
};
type Mount = {
  stage: HTMLElement;
  terrain: HTMLCanvasElement;
  fallback: HTMLCanvasElement;
  canopy: HTMLCanvasElement;
  pins: Array<HTMLButtonElement | null>;
  onZoom(value: number): void;
  onInteract(): void;
};
export function createScene(el: Mount, assets: Assets): SceneControls {
  const { stage, terrain, fallback, canopy, pins } = el;
  const surface = makeSurface(terrain, fallback, assets), ctx = canopy.getContext("2d")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 1, height = 1, centerX = 1, referenceWidth = 1, dpr = 1, frame = 0, closed = false, last = 0;
  let velocityLon = 0, velocityLat = 0, dragTime = 0, releasedAt = 0;
  const cam = { ...HOME }, target = { ...HOME };
  const points = exhibits.map(e => {
    const lat = e.latitude * RAD, lon = e.longitude * RAD;
    return xyz(lat, lon, 1.014 + altitude(assets.heights, lat, lon));
  });
  stage.dataset.renderer = surface.mode;
  const stop = new AbortController(), opts = { signal: stop.signal };
  let noticeSent = false;
  function interacted() { if (!noticeSent) {
    noticeSent = true;
    el.onInteract();
  } }
  function draw() {
    const rot = basis(cam), r = Math.min(referenceWidth * .383, height * .406) * cam.zoom;
    surface.draw(cam, width, height, r, centerX);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const visible = [];
    for (let i = 0; i < assets.trees.length; i++) {
      const t = assets.trees[i];
      const [x, y, z] = project(t.x, t.y, t.z, rot);
      if (z < .015 || (surface.depthAt && surface.depthAt(x, y) > z + .027))
        continue;
      visible.push({ x, y, z, t });
    }
    visible.sort((a, b) => a.z - b.z);
    const sprite = 96;
    for (const { x, y, z, t } of visible) {
      const len = Math.hypot(x, y, z), n = z / len, rr = r;
      const size = t.size * r * (.92 + .15 * n);
      const theta = Math.atan2(x, y), co = Math.cos(theta), si = Math.sin(theta);
      const sx = centerX + rr * x, sy = height * .5 - rr * y;
      // Two crown inclinations keep a tree radial on the rim and fuller face-on.
      const row = n > .65 ? 0 : 1;
      ctx.setTransform(dpr * co, dpr * si, -dpr * si, dpr * co, dpr * sx, dpr * sy);
      ctx.drawImage(assets.leaves, t.kind * sprite, row * sprite, sprite, sprite, -size * .5, -size * .89, size, size);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Transparent canopy in shadow: color only existing pixels.
    ctx.globalCompositeOperation = "source-atop";
    const shadow = ctx.createLinearGradient(centerX - r * .65, height * .5 - r, centerX + r * .6, height * .5 + r);
    shadow.addColorStop(0, "rgba(2,23,25,0)");
    shadow.addColorStop(.55, "rgba(2,23,25,.08)");
    shadow.addColorStop(1, "rgba(2,20,24,.75)");
    ctx.fillStyle = shadow;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
    points.forEach(([wx, wy, wz], i) => {
      const pin = pins[i];
      if (!pin)
        return;
      const [x, y, z] = project(wx, wy, wz, rot), px = centerX + r * x, py = height * .5 - r * y;
      const visible = z > .24 && px > 18 && px < width - 18 && py > 15 && py < height - 22;
      pin.hidden = !visible;
      if (visible) {
        pin.style.left = px + "px";
        pin.style.top = py + "px";
        pin.classList.toggle("inward", px > width * .68);
      }
    });
    stage.dataset.longitude = (cam.lon / RAD).toFixed(2);
    stage.dataset.latitude = (cam.lat / RAD).toFixed(2);
    stage.dataset.zoom = cam.zoom.toFixed(3);
    el.onZoom(Math.round(cam.zoom * 100));
  }
  function animate(ts: number) {
    frame = 0;
    if (closed)
      return;
    const dt = Math.min(40, Math.max(0, ts - (last || ts - 16)));
    const step = reduced ? 1 : 1 - Math.exp(-dt / 145);
    last = ts;
    if (!pointers.size && !reduced && ts - releasedAt < 650 && (Math.abs(velocityLon) + Math.abs(velocityLat) > .00001)) {
      target.lon += velocityLon * dt;
      target.lat = clamp(target.lat + velocityLat * dt, -1.43, 1.43);
      const friction = Math.exp(-dt / 150); velocityLon *= friction; velocityLat *= friction;
    }
    let moving = false;
    for (const k of ["lon", "lat", "zoom"] as const) {
      const d = target[k] - cam[k];
      if (Math.abs(d) < .0003)
        cam[k] = target[k];
      else {
        cam[k] += d * step;
        moving = true;
      }
    }
    draw();
    if (moving || (!pointers.size && Math.abs(velocityLon) + Math.abs(velocityLat) > .00001 && ts - releasedAt < 650))
      request();
  }
  function request() { if (!frame && !closed)
    frame = requestAnimationFrame(animate); }
  function resize() {
    const box = stage.getBoundingClientRect();
    width = box.width;
    height = box.height;
    const observatory = stage.parentElement!.getBoundingClientRect();
    referenceWidth = observatory.width;
    centerX = observatory.left - box.left + observatory.width * .5;
    if (width < 1 || height < 1)
      return;
    dpr = Math.min(window.devicePixelRatio || 1, width < 560 ? 1.5 : 2);
    for (const c of [terrain, fallback, canopy]) {
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
    }
    draw();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  function zoomBy(factor: number) { interacted(); target.zoom = clamp(target.zoom * factor, .72, 2.4); request(); }
  function orient(lon: number, lat: number, zoom: number) {
    velocityLon = velocityLat = 0;
    const delta = Math.atan2(Math.sin(lon - cam.lon), Math.cos(lon - cam.lon));
    target.lon = cam.lon + delta;
    target.lat = lat;
    target.zoom = zoom;
    request();
  }
  const pointers = new Map<number, {
    x: number;
    y: number;
  }>();
  let initialPinch = 0, initialZoom = 1;
  function pinchDistance() { const [a, b] = pointers.values(); return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0; }
  // Listen on the stage so captured pointers continue rotating outside the canvas.
  stage.addEventListener("pointerdown", e => {
    if ((e.target as HTMLElement).closest("button") || e.button !== 0)
      return;
    e.preventDefault();
    velocityLon = velocityLat = 0; dragTime = e.timeStamp;
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      initialPinch = pinchDistance();
      initialZoom = target.zoom;
    }
    stage.classList.add("holding");
  }, opts);
  stage.addEventListener("pointermove", e => {
    const p = pointers.get(e.pointerId);
    if (!p)
      return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;
    if (!dx && !dy)
      return;
    interacted();
    if (pointers.size === 2 && initialPinch > 1)
      target.zoom = clamp(initialZoom * pinchDistance() / initialPinch, .72, 2.4);
    else if (pointers.size === 1) {
      const sensitivity = 2.7 / (Math.min(referenceWidth, height) * target.zoom);
      const deltaLon = -dx * sensitivity, deltaLat = dy * sensitivity;
      const elapsed = Math.max(8, Math.min(80, e.timeStamp - dragTime));
      velocityLon = clamp(deltaLon / elapsed, -.004, .004);
      velocityLat = clamp(deltaLat / elapsed, -.004, .004);
      dragTime = e.timeStamp;
      target.lon += deltaLon;
      target.lat = clamp(target.lat + deltaLat, -1.43, 1.43);
    }
    request();
  }, opts);
  function release(e: PointerEvent) { if (!pointers.has(e.pointerId)) return; pointers.delete(e.pointerId); if (!pointers.size) {
    if (e.type !== "pointerup" || e.timeStamp - dragTime > 90) velocityLon = velocityLat = 0;
    releasedAt = performance.now(); stage.classList.remove("holding"); request();
  } }
  for (const ev of ["pointerup", "pointercancel", "lostpointercapture"] as const)
    stage.addEventListener(ev, release, opts);
  stage.addEventListener("wheel", e => { e.preventDefault(); const d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? height : 1); zoomBy(Math.exp(-clamp(d, -160, 160) * .0017)); }, { ...opts, passive: false });
  stage.addEventListener("keydown", e => {
    if (e.target !== stage)
      return;
    if (e.key === "ArrowLeft")
      target.lon -= .15;
    else if (e.key === "ArrowRight")
      target.lon += .15;
    else if (e.key === "ArrowUp")
      target.lat = clamp(target.lat + .13, -1.43, 1.43);
    else if (e.key === "ArrowDown")
      target.lat = clamp(target.lat - .13, -1.43, 1.43);
    else if (e.key === "+" || e.key === "=")
      zoomBy(1.15);
    else if (e.key === "-")
      zoomBy(1 / 1.15);
    else if (e.key === "Home")
      orient(HOME.lon, HOME.lat, 1);
    else
      return;
    e.preventDefault();
    interacted();
    request();
  }, opts);
  resize();
  return {
    zoomBy,
    reset() {
      velocityLon = velocityLat = 0;
      Object.assign(target, HOME);
      Object.assign(cam, HOME);
      cancelAnimationFrame(frame);
      frame = 0;
      draw();
    },
    visit(id) { const e = exhibits.find(p => p.id === id); if (e) {
      interacted();
      orient(e.longitude * RAD, e.latitude * RAD, 1.16);
    } },
    dispose() { closed = true; cancelAnimationFrame(frame); ro.disconnect(); stop.abort(); surface.dispose(); }
  };
}
