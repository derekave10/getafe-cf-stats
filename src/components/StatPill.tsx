interface StatPillProps {
  label: string;
  value: number | string;
  highlight?: boolean;
  size?: "sm" | "lg";
}

export default function StatPill({ label, value, highlight = false, size = "sm" }: StatPillProps) {
  const isLarge = size === "lg";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.125rem" }}>
      <span
        className="tabular"
        style={{
          fontFamily: "var(--font-barlow)",
          fontWeight: 800,
          fontSize: isLarge ? "clamp(2rem, 4vw, 3rem)" : "clamp(1.25rem, 2.5vw, 1.75rem)",
          color: highlight ? "#F9EC2E" : "#ffffff",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: isLarge ? "0.6rem" : "0.55rem", color: "rgba(221,221,220,0.55)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </span>
    </div>
  );
}
