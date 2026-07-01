"use client";

import { useEffect, useMemo, useRef } from "react";

type Vec2 = [number, number];

type FaultyTerminalProps = {
  scale?: number;
  gridMul?: Vec2;
  digitSize?: number;
  timeScale?: number;
  pause?: boolean;
  scanlineIntensity?: number;
  glitchAmount?: number;
  flickerAmount?: number;
  noiseAmp?: number;
  chromaticAberration?: number;
  dither?: number | boolean;
  curvature?: number;
  tint?: string;
  mouseReact?: boolean;
  mouseStrength?: number;
  dpr?: number;
  pageLoadAnimation?: boolean;
  brightness?: number;
  className?: string;
  style?: React.CSSProperties;
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").trim();
  const value = Number.parseInt(
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized,
    16
  );
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function hash(x: number, y: number, seed: number) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return value - Math.floor(value);
}

function fbm(
  px: number,
  py: number,
  time: number,
  noiseAmp: number
): number {
  let x = px * 1.1;
  let y = py * 1.1;
  let f = 0;
  let amp = 0.5 * noiseAmp;

  const angle0 = time * 0.02;
  const c0 = Math.cos(angle0);
  const s0 = Math.sin(angle0);
  f += amp * (Math.sin(x * 10) * Math.sin(y * (3 + Math.sin(time * 0.090909))) + 0.2);
  const nx0 = c0 * x * 2 - s0 * y * 2;
  const ny0 = s0 * x * 2 + c0 * y * 2;
  x = nx0;
  y = ny0;
  amp *= 0.454545;

  const angle1 = time * 0.02;
  const c1 = Math.cos(angle1);
  const s1 = Math.sin(angle1);
  f += amp * (Math.sin(x * 10) * Math.sin(y * (3 + Math.sin(time * 0.090909))) + 0.2);
  const nx1 = c1 * x * 2 - s1 * y * 2;
  const ny1 = s1 * x * 2 + c1 * y * 2;
  x = nx1;
  y = ny1;
  amp *= 0.454545;

  const angle2 = time * 0.08;
  const c2 = Math.cos(angle2);
  const s2 = Math.sin(angle2);
  f += amp * (Math.sin(x * 10) * Math.sin(y * (3 + Math.sin(time * 0.090909))) + 0.2);

  return f;
}

function pattern(
  px: number,
  py: number,
  time: number,
  noiseAmp: number
): number {
  const cos01 = Math.cos(0.1 * time);
  const sin01 = Math.sin(0.1 * time);
  const cos1 = Math.cos(0.1);
  const sin1 = Math.sin(0.1);

  const qx = fbm(px + 1, py + 1, time, noiseAmp);
  const qy = fbm(cos01 * px + 1, sin01 * px + py + 1, time, noiseAmp);

  const rx = fbm(cos1 * qx + 0, sin1 * qx + qy + 0, time, noiseAmp);
  const ry = fbm(qx + 0, qy + 0, time, noiseAmp);

  return fbm(px + rx, py + ry, time, noiseAmp);
}

function digit(
  px: number,
  py: number,
  time: number,
  gridMul: Vec2,
  digitSize: number,
  scale: number,
  noiseAmp: number,
  mouseX: number,
  mouseY: number,
  mouseReact: boolean,
  mouseStrength: number,
  pageLoadProgress: number,
  usePageLoad: boolean
): number {
  const gridX = gridMul[0] * 15;
  const gridY = gridMul[1] * 15;
  const sx = Math.floor(px * gridX) / gridX;
  const sy = Math.floor(py * gridY) / gridY;
  const gx = px * gridX;
  const gy = py * gridY;

  let intensity = pattern(sx * 0.1, sy * 0.1, time, noiseAmp) * 1.3 - 0.03;

  if (mouseReact) {
    const mouseWorldX = mouseX * scale;
    const mouseWorldY = mouseY * scale;
    const dx = sx - mouseWorldX;
    const dy = sy - mouseWorldY;
    const distToMouse = Math.sqrt(dx * dx + dy * dy);
    const mouseInfluence =
      Math.exp(-distToMouse * 8) * mouseStrength * 10;
    intensity += mouseInfluence;
    const ripple =
      Math.sin(distToMouse * 20 - time * 3.333 * 5) * 0.1 * mouseInfluence;
    intensity += ripple;
  }

  if (usePageLoad) {
    const cellRandom = hash(sx, sy, 0);
    const cellDelay = cellRandom * 0.8;
    const cellProgress = Math.max(
      0,
      Math.min(1, (pageLoadProgress - cellDelay) / 0.2)
    );
    intensity *= cellProgress;
  }

  let fx = gx - Math.floor(gx);
  let fy = gy - Math.floor(gy);
  fx *= digitSize;
  fy *= digitSize;

  const py5 = (1 - fy) * 5;
  const px5 = fx * 5;
  const x = px5 - Math.floor(px5);
  const y = py5 - Math.floor(py5);

  const i = Math.floor(py5) - 2;
  const j = Math.floor(px5) - 2;
  const n = i * i + j * j;
  const f = n * 0.0625;

  const isOn = intensity - f >= 0.1 ? 1 : 0;
  const brightnessVal = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);

  const inBounds =
    fx >= 0 && fx <= 1 && fy >= 0 && fy <= 1 ? 1 : 0;
  return inBounds * brightnessVal;
}

function onOff(a: number, b: number, c: number, time: number, flickerAmount: number) {
  return (Math.sin(time + a * Math.cos(time * b)) >= c ? 1 : 0) * flickerAmount;
}

function displace(
  lookY: number,
  time: number,
  flickerAmount: number
): number {
  const y = lookY - ((time * 0.25) % 1);
  const windowVal = 1 / (1 + 50 * y * y);
  return (
    Math.sin(lookY * 20 + time * 3.333) *
    0.0125 *
    onOff(4, 2, 0.8, time * 3.333, flickerAmount) *
    (1 + Math.cos(time * 3.333 * 60)) *
    windowVal
  );
}

export function FaultyTerminal({
  scale = 1.4,
  gridMul = [2, 1],
  digitSize = 1.3,
  timeScale = 0.5,
  pause = false,
  scanlineIntensity = 0.6,
  glitchAmount = 1,
  flickerAmount = 1,
  noiseAmp = 1,
  chromaticAberration = 0,
  dither = 0,
  curvature = 0.28,
  tint = "#A89B8C",
  mouseReact = true,
  mouseStrength = 0.5,
  dpr = 1.15,
  pageLoadAnimation = true,
  brightness = 0.6,
  className,
  style,
}: FaultyTerminalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const visibleRef = useRef(false);
  const tintRgb = useMemo(() => hexToRgb(tint), [tint]);
  const ditherValue = typeof dither === "boolean" ? (dither ? 1 : 0) : dither;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let lastFrame = 0;
    const startedAt = performance.now();
    const frameInterval = 1000 / 30;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, dpr);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(canvas);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0.5, y: 0.5 };
    };

    canvas.parentElement?.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });
    canvas.parentElement?.addEventListener("mouseleave", handleMouseLeave);

    const draw = (now: number) => {
      animationFrame = requestAnimationFrame(draw);

      if (!visibleRef.current || pause) return;
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;

      const elapsed = (now - startedAt) * 0.001 * timeScale;
      const loadProgress = pageLoadAnimation
        ? Math.min(1, (now - startedAt) / 1200)
        : 1;

      const mouse = smoothMouseRef.current;
      mouse.x += (mouseRef.current.x - mouse.x) * 0.08;
      mouse.y += (mouseRef.current.y - mouse.y) * 0.08;

      const baseCell = Math.max(6, 10 / digitSize);
      const cellWidth = baseCell * gridMul[0];
      const cellHeight = baseCell * 0.82 * gridMul[1];
      const cols = Math.ceil(width / cellWidth) + 6;
      const rows = Math.ceil(height / cellHeight) + 6;
      const tintBoost = 18 + chromaticAberration * 8;

      // Background
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(0, 0, width, height);

      // Radial glow
      const glow = ctx.createRadialGradient(
        width * 0.52,
        height * 0.48,
        0,
        width * 0.52,
        height * 0.48,
        width * 0.58
      );
      glow.addColorStop(
        0,
        `rgba(${tintRgb.r}, ${tintRgb.g}, ${tintRgb.b}, ${0.14 * brightness})`
      );
      glow.addColorStop(
        0.56,
        `rgba(${tintRgb.r}, ${tintRgb.g}, ${tintRgb.b}, ${0.05 * brightness})`
      );
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Digit grid
      for (let row = -3; row < rows; row++) {
        for (let col = -3; col < cols; col++) {
          const x = col * cellWidth;
          const y = row * cellHeight;
          const nx = (x / width) * 2 - 1;
          const ny = (y / height) * 2 - 1;
          const radius = nx * nx + ny * ny;
          const warpedX = nx * (1 + curvature * radius);
          const warpedY = ny * (1 + curvature * radius * 0.82);

          if (Math.abs(warpedX) > 1.16 || Math.abs(warpedY) > 1.16)
            continue;

          const patternX = warpedX * 4.2 * scale;
          const patternY = warpedY * 3.4 * scale;

          const band =
            Math.sin(patternX * 2.2 + elapsed * 1.8) +
            Math.sin(patternY * 3.1 - elapsed * 1.2) +
            Math.sin((patternX + patternY) * 2.7 + elapsed * 0.8);
          const cellNoise = hash(col, row, Math.floor(elapsed * 2.5)) * noiseAmp;
          const largeMask = Math.sin(
            patternX * 0.88 - patternY * 1.15 + cellNoise * 2.8
          );
          const mouseDistance = Math.hypot(
            x / width - mouse.x,
            y / height - mouse.y
          );
          const mouseWave = mouseReact
            ? Math.max(0, 1 - mouseDistance / 0.26) *
              mouseStrength *
              (0.8 + Math.sin(mouseDistance * 62 - elapsed * 8) * 0.22)
            : 0;
          const intensity =
            band * 0.28 + largeMask * 0.52 + cellNoise * 0.72 + mouseWave;
          const loadGate = hash(col, row, 2) < loadProgress + 0.18;

          if (!loadGate || intensity < 0.22) continue;

          const fade =
            Math.min(1, Math.max(0.18, (intensity - 0.12) * 0.92)) *
            loadProgress;
          const dashWidth = Math.max(3, cellWidth * 0.72);
          const dashHeight = Math.max(1, cellHeight * 0.18);
          const bars = intensity > 0.88 ? 4 : intensity > 0.56 ? 3 : 2;
          const jitter =
            (hash(col, row, 9) - 0.5) * cellWidth * 0.24 * glitchAmount;

          ctx.fillStyle = `rgba(${tintRgb.r}, ${Math.min(255, tintRgb.g + tintBoost)}, ${Math.min(255, tintRgb.b + tintBoost)}, ${fade * brightness})`;

          for (let bar = 0; bar < bars; bar++) {
            const barY =
              y + bar * dashHeight * 1.85 + hash(col, row + bar, 5) * 0.5;
            ctx.fillRect(x + jitter, barY, dashWidth, dashHeight);
          }

          if (intensity > 1.04) {
            ctx.fillStyle = `rgba(154, 198, 255, ${fade * 0.22 * brightness})`;
            ctx.fillRect(
              x + jitter,
              y - dashHeight * 0.8,
              dashWidth * 0.82,
              dashHeight
            );
          }
        }
      }

      // Scanlines
      for (let line = 0; line < height; line += 3) {
        ctx.fillStyle = `rgba(0, 0, 0, ${0.38 * scanlineIntensity})`;
        ctx.fillRect(0, line, width, 1);
      }

      // Glitch lines
      for (let index = 0; index < 4 * glitchAmount; index++) {
        const glitchY =
          ((hash(index, Math.floor(elapsed * 8), 7) * height +
            Math.sin(elapsed * (index + 1.7)) * 18) %
            height +
            height) %
          height;
        const glitchHeight = 1 + index * 0.8;
        ctx.fillStyle = `rgba(${tintRgb.r}, ${tintRgb.g}, ${tintRgb.b}, ${0.05 * brightness})`;
        ctx.fillRect(
          Math.sin(elapsed * 14 + index) * 34,
          glitchY,
          width,
          glitchHeight
        );
      }

      // Flicker
      const flicker =
        (Math.sin(elapsed * 82) * 0.5 + 0.5) * 0.05 * flickerAmount;
      ctx.fillStyle = `rgba(255, 255, 255, ${flicker})`;
      ctx.fillRect(0, 0, width, height);

      // Dither
      if (ditherValue > 0) {
        for (
          let dot = 0;
          dot < width * height * 0.00008 * ditherValue;
          dot++
        ) {
          const dotX = hash(dot, Math.floor(elapsed * 10), 11) * width;
          const dotY = hash(dot, Math.floor(elapsed * 10), 13) * height;
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
          ctx.fillRect(dotX, dotY, 1, 1);
        }
      }

      // Vignette
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        height * 0.2,
        width / 2,
        height / 2,
        width * 0.62
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(0.66, "rgba(0, 0, 0, 0.1)");
      vignette.addColorStop(
        1,
        `rgba(0, 0, 0, ${0.82 + curvature * 0.12})`
      );
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.parentElement?.removeEventListener("mousemove", handleMouseMove);
      canvas.parentElement?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    brightness,
    chromaticAberration,
    curvature,
    digitSize,
    ditherValue,
    dpr,
    flickerAmount,
    glitchAmount,
    gridMul,
    mouseReact,
    mouseStrength,
    noiseAmp,
    pageLoadAnimation,
    pause,
    scanlineIntensity,
    scale,
    timeScale,
    tintRgb.r,
    tintRgb.g,
    tintRgb.b,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", ...style }}
      aria-hidden="true"
    />
  );
}
