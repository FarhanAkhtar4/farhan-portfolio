interface ClassifiedStampProps {
  text?: string;
  className?: string;
}

export default function ClassifiedStamp({
  text = "TOP SECRET // NOFORN",
  className = "",
}: ClassifiedStampProps) {
  return (
    <div className={`classified-stamp ${className}`} aria-hidden="true">
      {text}
    </div>
  );
}
