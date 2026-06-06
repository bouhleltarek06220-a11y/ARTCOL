"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import createGlobe from "cobe";
import { useRouter } from "next/navigation";

/* Pool de capitales/grandes villes pour distribuer automatiquement les articles
   qui n'ont pas de coords explicites dans leur frontmatter. */
const DEFAULT_LOCATIONS = [
  [48.8566, 2.3522], // Paris
  [40.7128, -74.006], // New York
  [35.6762, 139.6503], // Tokyo
  [51.5074, -0.1278], // Londres
  [1.3521, 103.8198], // Singapour
  [-33.8688, 151.2093], // Sydney
  [55.7558, 37.6173], // Moscou
  [19.4326, -99.1332], // Mexico
  [-23.5505, -46.6333], // São Paulo
  [25.2048, 55.2708], // Dubaï
];

function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function locationFor(article, index) {
  if (
    article.planet?.lat != null &&
    article.planet?.lng != null &&
    !Number.isNaN(article.planet.lat) &&
    !Number.isNaN(article.planet.lng)
  ) {
    return [article.planet.lat, article.planet.lng];
  }
  const seed = hashSlug(article.slug) + index;
  return DEFAULT_LOCATIONS[seed % DEFAULT_LOCATIONS.length];
}

export default function GlobeCosmos({ articles, size = "lg" }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const markers = useMemo(
    () =>
      articles.map((a, i) => ({
        id: `m-${a.slug}`,
        article: a,
        location: locationFor(a, i),
        delay: (i * 0.45) % 2,
      })),
    [articles],
  );

  const handlePointerDown = useCallback((e) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe = null;
    let animationId;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.25,
        dark: 1,
        diffuse: 1.4,
        mapSamples: 18000,
        mapBrightness: 8,
        // Palette AMAVYA : base terre chaude tirant vers le doré
        baseColor: [0.6, 0.55, 0.45],
        // Cyan-bleu lumineux pour les pulses (les "points bleus")
        markerColor: [0.2, 0.85, 0.95],
        // Halo brun-doré subtil autour du globe
        glowColor: [0.18, 0.14, 0.06],
        markerElevation: 0,
        markers: markers.map((m) => ({
          location: m.location,
          size: 0.03,
          id: m.id,
        })),
      });

      function animate() {
        if (!isPausedRef.current) phi += 0.0028;
        globe.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.25 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [markers]);

  const maxWidth = size === "sm" ? "max-w-sm" : size === "md" ? "max-w-md" : "max-w-2xl";

  return (
    <div className={`relative mx-auto aspect-square w-full ${maxWidth} select-none`}>
      <style>{`
        @keyframes pulse-expand {
          0% { transform: scale(0.35); opacity: 0.85; }
          100% { transform: scale(1.7); opacity: 0; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {markers.map((m) => (
        <button
          type="button"
          key={m.id}
          aria-label={m.article.title}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/blog/${m.article.slug}`);
          }}
          className="group"
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning (cobe expose des CSS vars)
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(center)",
            left: "anchor(center)",
            translate: "-50% 50%",
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: 0,
            padding: 0,
            cursor: "pointer",
            pointerEvents: "auto",
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 6px))`,
            transition: "opacity 0.4s, filter 0.4s",
          }}
        >
          {/* 1er anneau pulsant */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid #33ccdd",
              borderRadius: "50%",
              opacity: 0,
              animation: `pulse-expand 2s ease-out infinite ${m.delay}s`,
            }}
          />
          {/* 2e anneau décalé */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid #33ccdd",
              borderRadius: "50%",
              opacity: 0,
              animation: `pulse-expand 2s ease-out infinite ${m.delay + 0.55}s`,
            }}
          />
          {/* Pastille centrale */}
          <span
            aria-hidden="true"
            style={{
              width: 12,
              height: 12,
              background: "#33ccdd",
              borderRadius: "50%",
              boxShadow:
                "0 0 0 3px #0a0a0b, 0 0 0 5px #33ccdd, 0 0 22px 3px #33ccdd",
              transition: "transform 0.3s ease",
            }}
            className="group-hover:scale-125"
          />
        </button>
      ))}
    </div>
  );
}
