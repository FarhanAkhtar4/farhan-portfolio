import ClassifiedStamp from "./ClassifiedStamp";

interface DossierCardProps {
  children: React.ReactNode;
  caseNo?: string;
  classified?: boolean;
  className?: string;
}

export default function DossierCard({
  children,
  caseNo,
  classified = false,
  className = "",
}: DossierCardProps) {
  return (
    <div
      className={`glass-card p-4 sm:p-6 relative ${className}`}
    >
      {/* Case Number Badge */}
      {caseNo && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <span className="font-mono text-[9px] font-bold tracking-[2px] uppercase text-[#4a6b7c]/60 bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.06)] px-2 py-1 rounded-sm">
            {caseNo}
          </span>
        </div>
      )}

      {/* Classified Stamp Overlay */}
      {classified && (
        <div className="absolute top-4 right-4 opacity-40 pointer-events-none">
          <ClassifiedStamp text="CLASSIFIED" />
        </div>
      )}

      {/* Content */}
      <div className={classified ? "pr-24" : ""}>{children}</div>
    </div>
  );
}
