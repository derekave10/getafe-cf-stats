import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", background: "rgba(0,33,94,0.85)" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", height: "4rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", opacity: 1 }}>
          <Image src="/logo-getafe.png" alt="Getafe CF" width={36} height={36} style={{ objectFit: "contain" }} />
          <div>
            <p style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, fontSize: "1.1rem", color: "#ffffff", lineHeight: 1, letterSpacing: "0.05em", margin: 0 }}>
              GETAFE CF
            </p>
            <p style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, fontSize: "0.65rem", color: "rgba(221,221,220,0.6)", textTransform: "uppercase", letterSpacing: "0.15em", lineHeight: 1, margin: 0 }}>
              Portal de Jugadores
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
