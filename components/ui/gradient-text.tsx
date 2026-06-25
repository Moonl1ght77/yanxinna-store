"use client";

import "./gradient-text.css";

type GradientTextProps = {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

export function GradientText({
  children,
  className = "",
  as: Tag = "span",
}: GradientTextProps) {
  return (
    <Tag className={`gradient-text ${className}`}>
      <span className="gradient-text-bg" />
      <span className="gradient-text-content">{children}</span>
    </Tag>
  );
}
