import { ImageResponse } from "next/og";
import { LOGO_PATH } from "@/components/ui/Logo";
import { site } from "@/content/site";

export const alt = `${site.name.first} ${site.name.last} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Gerada no build (rota estática). Usa a fonte padrão do ImageResponse para não depender de
// download de fonte durante o build.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0f0f0e",
          color: "#ece8df",
        }}
      >
        <svg width="180" height="80" viewBox="-4 -4 593 268">
          <path d={LOGO_PATH} fill="none" stroke="#ece8df" strokeWidth="10" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 120, lineHeight: 1, letterSpacing: -4, display: "flex" }}>
            <span>{`${site.name.first} ${site.name.last}`}</span>
            <span style={{ color: "#0702fe" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#9c978c", textTransform: "uppercase", letterSpacing: 3 }}>
            {`${site.role} · Vue · Nuxt · React · Next.js · VTEX`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
