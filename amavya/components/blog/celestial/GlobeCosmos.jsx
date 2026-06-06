"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import createGlobe from "cobe";

/**
 * Globe Terre interactif (cobe) avec markers cliquables génériques.
 *
 * Props :
 * - markers: [{ id, location: [lat,lng], label, delay?, onClick }]
 * - size: "sm" | "md" | "lg"
 * - enableZoom: bool (zoom à la molette, true par défaut)
 */
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 2.4;
const ZOOM_STEP = 0.12;

export default function GlobeCosmos({ markers = [], size = "lg", enableZoom = true }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const [zoom, setZoom] = useState(1);

  const safeMarkers = useMemo(
    () =>
      markers.map((m, i) => ({
        ...m,
        delay: m.delay != null ? m.delay : (i * 0.4) % 2,
      })),
    [markers],
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

  // Zoom à la molette de la souris (non-passive pour preventDefault).
  useEffect(() => {
    if (!enableZoom) return;
    const el = wrapperRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      setZoom((z) => {
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        const next = z + delta;
        return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, next));
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [enableZoom]);

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
        baseColor: [0.6, 0.55, 0.45],
        markerColor: [0.2, 0.85, 0.95], // cyan
        glowColor: [0.18, 0.14, 0.06],
        markerElevation: 0,
        markers: safeMarkers.map((m) => ({
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
  }, [safeMarkers]);

  const maxWidth =
    size === "sm" ? "max-w-sm" : size === "md" ? "max-w-md" : "max-w-2xl";

  return (
    <div
      ref={wrapperRef}
      className={`relative mx-auto aspect-square w-full ${maxWidth} select-none`}
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "center",
        transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
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
      {safeMarkers.map((m) => (
        <button
          type="button"
          key={m.id}
          aria-label={m.label || m.id}
          onClick={(e) => {
            e.stopPropagation();
            if (typeof m.onClick === "function") m.onClick(m);
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
