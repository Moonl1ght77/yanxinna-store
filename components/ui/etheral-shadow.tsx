"use client";

import { animate, motion, useMotionValue, type AnimationPlaybackControls } from "framer-motion";
import { type CSSProperties, type ReactNode, useEffect, useId, useRef } from "react";

type AnimationConfig = {
  scale: number;
  speed: number;
};

type NoiseConfig = {
  opacity: number;
  scale: number;
};

type EtherealShadowProps = {
  sizing?: "fill" | "stretch";
  color?: string;
  animation?: AnimationConfig;
  noise?: NoiseConfig;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
};

function mapRange(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number) {
  if (fromLow === fromHigh) {
    return toLow;
  }

  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

export function Component({
  sizing = "fill",
  color = "rgba(204, 188, 169, 0.95)",
  animation,
  noise,
  style,
  className,
  children
}: EtherealShadowProps) {
  const id = useId().replace(/:/g, "");
  const filterId = `etheral-shadow-${id}`;
  const animationEnabled = Boolean(animation && animation.scale > 0);
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const hueRotateMotionValue = useMotionValue(180);
  const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null);

  const displacementScale = animation ? mapRange(animation.scale, 1, 100, 18, 92) : 0;
  const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;
  const baseFrequency = animation
    ? `${mapRange(animation.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`
    : "0.001,0.004";
  const surfaceBackground = `
    radial-gradient(circle at 22% 18%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0) 24%),
    radial-gradient(circle at 76% 16%, rgba(215,228,243,0.82) 0%, rgba(215,228,243,0) 28%),
    radial-gradient(circle at 50% 72%, rgba(103,103,103,0.2) 0%, rgba(103,103,103,0) 34%),
    linear-gradient(180deg, rgba(245,247,251,0.96) 0%, ${color} 48%, rgba(108,108,108,0.96) 100%)
  `;

  useEffect(() => {
    if (!animationEnabled || !feColorMatrixRef.current) {
      return;
    }

    hueRotateAnimation.current?.stop();
    hueRotateMotionValue.set(0);
    hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
      duration: animationDuration / 25,
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear",
      onUpdate: (value) => {
        feColorMatrixRef.current?.setAttribute("values", String(value));
      }
    });

    return () => {
      hueRotateAnimation.current?.stop();
    };
  }, [animationDuration, animationEnabled, hueRotateMotionValue]);

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        ...style
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -displacementScale,
          filter: animationEnabled ? `url(#${filterId}) blur(4px)` : "none"
        }}
      >
        {animationEnabled ? (
          <svg aria-hidden="true" className="absolute h-0 w-0">
            <defs>
              <filter id={filterId}>
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={baseFrequency}
                  seed="0"
                  type="turbulence"
                />
                <feColorMatrix ref={feColorMatrixRef} in="undulation" type="hueRotate" values="180" />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="undulation"
                  scale={displacementScale}
                  result="distorted"
                />
                <feGaussianBlur in="distorted" stdDeviation="0.75" />
              </filter>
            </defs>
          </svg>
        ) : null}

        <motion.div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: surfaceBackground,
            backgroundSize: "140% 140%",
            backgroundPosition: "50% 50%",
            maskImage: "url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')",
            maskSize: sizing === "stretch" ? "100% 100%" : "cover",
            maskRepeat: "no-repeat",
            maskPosition: "center"
          }}
          animate={
            animationEnabled
              ? {
                  scale: [1, 1.035, 1.015, 1],
                  x: ["0%", "-1.5%", "1%", "0%"],
                  y: ["0%", "1.5%", "-1%", "0%"],
                  rotate: [0, 0.4, -0.25, 0],
                  backgroundPosition: ["50% 50%", "47% 46%", "53% 54%", "50% 50%"]
                }
              : undefined
          }
          transition={
            animationEnabled
              ? {
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              : undefined
          }
        />
      </div>

      {noise && noise.opacity > 0 ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url('https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png')",
            backgroundSize: `${noise.scale * 200}px`,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2
          }}
        />
      ) : null}

      {children ? <div className="relative z-10 h-full w-full">{children}</div> : null}
    </div>
  );
}

export { Component as EtheralShadow };
