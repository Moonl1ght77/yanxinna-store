"use client";

import { useRef, useMemo, useEffect } from "react";

type SilkBackgroundProps = {
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
};

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Silk fragment shader — flowing fabric with lighting
const fragmentShader = `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform float uSpeed;
uniform float uScale;
uniform vec3 uColor;
uniform float uNoiseIntensity;
uniform float uRotation;

// --- Noise ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
    dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x_) - 0.5;
  vec3 ox = floor(x_ + 0.5);
  vec3 a0 = x_ - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float f = 0.0;
  float w = 0.5;
  for (int i = 0; i < 5; i++) {
    f += w * snoise(p);
    p *= 2.0;
    w *= 0.5;
  }
  return f;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  uv.x *= aspect;

  float t = uTime * uSpeed * 0.15;

  // Rotation
  float angle = uRotation * 3.14159265 / 180.0;
  float ca = cos(angle);
  float sa = sin(angle);
  vec2 ruv = vec2(ca * uv.x - sa * uv.y, sa * uv.x + ca * uv.y);

  // Warped domain for organic folds
  float s = uScale * 1.8;
  vec2 q = vec2(
    fbm(ruv * s + vec2(0.0, 0.0) + t * 0.3),
    fbm(ruv * s + vec2(5.2, 1.3) + t * 0.2)
  );

  vec2 r = vec2(
    fbm(ruv * s + 4.0 * q + vec2(1.7, 9.2) + t * 0.15),
    fbm(ruv * s + 4.0 * q + vec2(8.3, 2.8) + t * 0.12)
  );

  float f = fbm(ruv * s + 4.0 * r);

  // Ridge pattern for silk folds
  float ridge = 1.0 - abs(f);
  ridge = ridge * ridge;

  // Flowing waves
  float wave1 = sin(ruv.x * 3.0 + ruv.y * 2.0 + t + f * 2.0) * 0.5 + 0.5;
  float wave2 = sin(ruv.x * 2.0 - ruv.y * 3.0 + t * 0.7 + f * 1.5) * 0.5 + 0.5;
  float wave3 = sin((ruv.x + ruv.y) * 4.0 + t * 0.5 + f) * 0.5 + 0.5;

  float silkPattern = ridge * 0.4 + wave1 * 0.25 + wave2 * 0.2 + wave3 * 0.15;
  silkPattern *= uNoiseIntensity;

  // Compute normal from pattern for lighting
  float eps = 0.002;
  float fR = fbm((ruv + vec2(eps, 0.0)) * s + 4.0 * r);
  float fL = fbm((ruv - vec2(eps, 0.0)) * s + 4.0 * r);
  float fU = fbm((ruv + vec2(0.0, eps)) * s + 4.0 * r);
  float fD = fbm((ruv - vec2(0.0, eps)) * s + 4.0 * r);

  vec3 normal = normalize(vec3(
    (1.0 - abs(fR)) - (1.0 - abs(fL)),
    (1.0 - abs(fU)) - (1.0 - abs(fD)),
    0.8
  ));

  // Light direction
  vec3 lightDir = normalize(vec3(0.6, -0.8, 1.0));
  float diffuse = max(dot(normal, lightDir), 0.0);

  // Specular — silk sheen
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 48.0);

  // Color
  vec3 darkColor = uColor * 0.25;
  vec3 lightColor = uColor * 1.4 + vec3(0.15);

  float lightVal = silkPattern * 0.35 + diffuse * 0.5 + spec * 0.3;
  lightVal = clamp(lightVal, 0.0, 1.0);

  vec3 col = mix(darkColor, uColor, smoothstep(0.0, 0.5, lightVal));
  col = mix(col, lightColor, smoothstep(0.5, 1.0, lightVal));

  // Subtle grain
  float grain = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.02;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return [
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  ];
}

export function SilkBackground({
  className,
  style,
  speed = 5,
  scale = 1,
  color = "#3B82F6",
  noiseIntensity = 1.5,
  rotation = 0,
}: SilkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const rafRef = useRef(0);
  const startRef = useRef(performance.now());

  const colorVec = useMemo(() => hexToRgb(color), [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;
    glRef.current = gl;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("Vertex shader error:", gl.getShaderInfoLog(vs));
      return;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Fragment shader error:", gl.getShaderInfoLog(fs));
      return;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    programRef.current = prog;
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const render = () => {
      rafRef.current = requestAnimationFrame(render);
      const t = (performance.now() - startRef.current) * 0.001;

      gl.useProgram(prog);
      gl.uniform1f(gl.getUniformLocation(prog, "uTime"), t);
      gl.uniform2f(
        gl.getUniformLocation(prog, "uResolution"),
        canvas.width,
        canvas.height
      );
      gl.uniform1f(gl.getUniformLocation(prog, "uSpeed"), speed);
      gl.uniform1f(gl.getUniformLocation(prog, "uScale"), scale);
      gl.uniform3f(
        gl.getUniformLocation(prog, "uColor"),
        colorVec[0],
        colorVec[1],
        colorVec[2]
      );
      gl.uniform1f(
        gl.getUniformLocation(prog, "uNoiseIntensity"),
        noiseIntensity
      );
      gl.uniform1f(gl.getUniformLocation(prog, "uRotation"), rotation);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [speed, scale, colorVec, noiseIntensity, rotation]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", ...style }}
      aria-hidden="true"
    />
  );
}
