import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AMAVYA — Quand l'IA travaille pour vous";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGLINE = "Quand l’IA travaille pour vous";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 50% 0%, #1a1408 0%, #050505 60%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 300,
            width: 600,
            height: 300,
            background:
              "radial-gradient(circle, rgba(240,210,122,0.30), transparent 70%)",
            filter: "blur(40px)",
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 200,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            backgroundImage:
              "linear-gradient(110deg, #a87f2e, #f0d27a 55%, #d4af37)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
            lineHeight: 1,
          }}
        >
          AMAVYA
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 48,
            color: "#e9e9f2",
            letterSpacing: "0.01em",
            display: "flex",
          }}
        >
          {TAGLINE}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 56,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#f0d27a",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 24,
              color: "#9b9bb0",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            amavya.cloud
          </div>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#f0d27a",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
