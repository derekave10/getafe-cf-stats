import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Getafe CF — Portal de Jugadores",
  description: "Estadísticas históricas acumuladas de cada jugador del Getafe CF.",
  openGraph: {
    title: "Getafe CF — Portal de Jugadores",
    description: "Estadísticas históricas de la plantilla azulona.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${barlow.variable} ${dmSans.variable}`}>
      <body style={{ margin: 0, background: "#00215E" }}>{children}</body>
    </html>
  );
}
