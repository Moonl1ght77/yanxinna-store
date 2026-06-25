"use client";

import "./shiny-text.css";

type ShinyTextProps = {
  text: string;
  speed?: number;
  delay?: number;
  color?: string;
  shineColor?: string;
  spread?: number;
  direction?: "left" | "right";
  yoyo?: boolean;
  pauseOnHover?: boolean;
  disabled?: boolean;
  className?: string;
};

export function ShinyText({
  text,
  speed = 2,
  delay = 0,
  color = "#ffffff",
  shineColor = "#ffffff",
  spread = 120,
  direction = "left",
  yoyo = false,
  pauseOnHover = false,
  disabled = false,
  className = "",
}: ShinyTextProps) {
  const animationName = direction === "left" ? "shine-left" : "shine-right";

  return (
    <span
      className={`shiny-text ${pauseOnHover ? "shiny-pause-on-hover" : ""} ${disabled ? "shiny-disabled" : ""} ${className}`}
      style={
        {
          "--shiny-color": color,
          "--shiny-shine-color": shineColor,
          "--shiny-spread": `${spread}deg`,
          "--shiny-speed": `${speed}s`,
          "--shiny-delay": `${delay}s`,
          "--shiny-animation": animationName,
          "--shiny-iteration": yoyo ? "infinite alternate" : "infinite",
          color,
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  );
}
