import { type Assets } from "./assets";
import { basis, type Camera } from "./camera";
import { buildMesh } from "./mesh";
import { software } from "./software";
type Surface = {
  depthAt?(x: number, y: number): number;
  draw(camera: Camera, width: number, height: number, radius: number, centerX: number): void;
  dispose(): void;
  mode: string;
};
const vertex = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUV;
uniform vec4 uBasis;
uniform vec2 uScale;
uniform float uOffsetX;
varying vec3 vNormal;
varying vec2 vUV;
void main() {
 float d=dot(aPosition.xz,uBasis.yx);
 vec3 p=vec3(aPosition.x*uBasis.x-aPosition.z*uBasis.y,
       aPosition.y*uBasis.z-d*uBasis.w, d*uBasis.z+aPosition.y*uBasis.w);
 gl_Position=vec4(p.x*uScale.x + uOffsetX,p.y*uScale.y,-p.z*.7,1.0);
 float nd=dot(aNormal.xz,uBasis.yx);
 vNormal=normalize(vec3(aNormal.x*uBasis.x-aNormal.z*uBasis.y,
       aNormal.y*uBasis.z-nd*uBasis.w,nd*uBasis.z+aNormal.y*uBasis.w)); vUV=aUV;
}`;
const fragment = `
precision mediump float;
varying vec3 vNormal;
varying vec2 vUV;
uniform sampler2D uMap;
void main() {
 vec3 n=normalize(vNormal);
 vec3 l=normalize(vec3(-.58,.72,.67));
 float shade=.43+.81*max(dot(n,l),-.21);
 vec3 base=texture2D(uMap,vUV).rgb;
 float rim=pow(1.-max(n.z,0.),3.6)*(.26+.74*max(dot(n,l),0.));
 vec3 color=base*shade+vec3(.32,.45,.23)*rim;
 color+=vec3(.013,.032,.032)*(1.-max(dot(n,l),0.));
 gl_FragColor=vec4(color,1.);
}`;
function webgl(canvas: HTMLCanvasElement, assets: Assets): Surface | null {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "low-power", preserveDrawingBuffer: false });
  if (!gl)
    return null;
  const program = gl.createProgram()!;
  for (const [type, src] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw Error(gl.getShaderInfoLog(shader) ?? "shader");
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw Error(gl.getProgramInfoLog(program) ?? "link");
  gl.useProgram(program);
  const { vertices, indices, normals } = buildMesh(assets.heights, 272, 136);
  const vb = gl.createBuffer(), ib = gl.createBuffer(), nb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  for (const [name, sz, off] of [["aPosition", 3, 0], ["aUV", 2, 12]] as const) {
    const pos = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, sz, gl.FLOAT, false, 20, off);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, nb);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
  const normalPos = gl.getAttribLocation(program, "aNormal");
  gl.enableVertexAttribArray(normalPos);
  gl.vertexAttribPointer(normalPos, 3, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T])
    gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, assets.surface);
  const view = gl.getUniformLocation(program, "uBasis"), scale = gl.getUniformLocation(program, "uScale"), offset = gl.getUniformLocation(program, "uOffsetX");
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);
  return {
    mode: "webgl",
    draw(cam, w, h, r, centerX) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform4fv(view, basis(cam));
      gl.uniform2f(scale, 2 * r / w, 2 * r / h);
      gl.uniform1f(offset, 2 * centerX / w - 1);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    },
    dispose() { gl.deleteTexture(tex); gl.deleteBuffer(vb); gl.deleteBuffer(ib); gl.deleteBuffer(nb); gl.deleteProgram(program); }
  };
}
export function makeSurface(canvas: HTMLCanvasElement, fallback: HTMLCanvasElement, assets: Assets): Surface {
  let surface: Surface | null = null;
  try {
    surface = webgl(canvas, assets);
  }
  catch { /* Software projection uses its own canvas. */ }
  canvas.hidden = !surface;
  fallback.hidden = !!surface;
  return surface ?? software(fallback, assets);
}
