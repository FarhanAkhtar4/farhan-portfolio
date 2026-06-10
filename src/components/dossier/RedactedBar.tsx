interface RedactedBarProps {
  width?: string;
  height?: string;
  className?: string;
}

export default function RedactedBar({
  width = "100%",
  height = "24px",
  className = "",
}: RedactedBarProps) {
  return (
    <div
      className={`redacted-bar ${className}`}
      style={{ width, height }}
      role="presentation"
      aria-label="Redacted information"
    />
  );
}
