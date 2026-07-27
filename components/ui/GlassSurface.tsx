"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";
import "./GlassSurface.css";

type GlassSurfaceProps = {
  children: ReactNode;
  className?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  backgroundOpacity?: number;
  saturation?: number;
  lightAngle?: number;
  lightIntensity?: number;
  refraction?: number;
  depth?: number;
  dispersion?: number;
  frost?: number;
  splay?: number;
};

type GlassStyle = CSSProperties & {
  "--glass-background-opacity": number;
  "--glass-depth-shadow-alpha": number;
  "--glass-edge-alpha": number;
  "--glass-filter": string;
  "--glass-frost-blur": string;
  "--glass-light-alpha": number;
  "--glass-light-angle": string;
  "--glass-light-mid-alpha": number;
  "--glass-light-midpoint": string;
  "--glass-light-opposite-angle": string;
  "--glass-light-rim-alpha": number;
  "--glass-light-splay": string;
  "--glass-saturation": number;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function GlassSurface({
  children,
  className,
  width = "100%",
  height = 78,
  borderRadius = 50,
  backgroundOpacity = 0.12,
  saturation = 1.18,
  lightAngle = -45,
  lightIntensity = 80,
  refraction = 100,
  depth = 100,
  dispersion = 100,
  frost = 12,
  splay = 80,
}: GlassSurfaceProps) {
  const depthFactor = clamp(depth) / 100;
  const dispersionFactor = clamp(dispersion) / 100;
  const lightFactor = clamp(lightIntensity) / 100;
  const refractionFactor = clamp(refraction) / 100;
  const splayValue = clamp(splay, 1, 100);
  const borderWidth = 0.025 + depthFactor * 0.025;
  const brightness = 34 + depthFactor * 6;
  const mapOpacity = 0.36 + depthFactor * 0.22;
  const distortionScale = -(0.75 + refractionFactor * 2.25);
  const dispersionOffset = dispersionFactor * 0.75;
  const lightAlpha = 0.14 + lightFactor * 0.6;
  const lightMidAlpha = 0.04 + lightFactor * 0.14;
  const lightRimAlpha = 0.08 + lightFactor * 0.16;
  const reactId = useId().replace(/:/g, "");
  const filterId = `liquid-glass-filter-${reactId}`;
  const redGradientId = `liquid-glass-red-${reactId}`;
  const blueGradientId = `liquid-glass-blue-${reactId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const outputBlurRef = useRef<SVGFEGaussianBlurElement>(null);
  const [supportsSvgFilter, setSupportsSvgFilter] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function updateFilter(element: HTMLDivElement) {
      const rect = element.getBoundingClientRect();
      const edgeSize =
        Math.min(rect.width, rect.height) * borderWidth * 0.5;
      const innerWidth = Math.max(0, rect.width - edgeSize * 2);
      const innerHeight = Math.max(0, rect.height - edgeSize * 2);
      const map = `
        <svg viewBox="0 0 ${rect.width} ${rect.height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${redGradientId}" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="red"/>
            </linearGradient>
            <linearGradient id="${blueGradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="blue"/>
            </linearGradient>
          </defs>
          <rect width="${rect.width}" height="${rect.height}" fill="black"/>
          <rect width="${rect.width}" height="${rect.height}" rx="${borderRadius}" fill="url(#${redGradientId})"/>
          <rect width="${rect.width}" height="${rect.height}" rx="${borderRadius}" fill="url(#${blueGradientId})" style="mix-blend-mode:difference"/>
          <rect x="${edgeSize}" y="${edgeSize}" width="${innerWidth}" height="${innerHeight}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${mapOpacity})" style="filter:blur(3px)"/>
        </svg>
      `;

      mapRef.current?.setAttribute(
        "href",
        `data:image/svg+xml,${encodeURIComponent(map)}`,
      );
    }

    const channels = [
      [redChannelRef, -dispersionOffset],
      [greenChannelRef, 0],
      [blueChannelRef, dispersionOffset],
    ] as const;

    channels.forEach(([ref, offset]) => {
      ref.current?.setAttribute("scale", String(distortionScale + offset));
      ref.current?.setAttribute("xChannelSelector", "R");
      ref.current?.setAttribute("yChannelSelector", "G");
    });
    outputBlurRef.current?.setAttribute("stdDeviation", "0");

    const resizeObserver = new ResizeObserver(() => updateFilter(container));
    resizeObserver.observe(container);
    updateFilter(container);

    return () => resizeObserver.disconnect();
  }, [
    blueGradientId,
    borderRadius,
    borderWidth,
    brightness,
    dispersionOffset,
    distortionScale,
    mapOpacity,
    redGradientId,
  ]);

  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.backdropFilter = `url(#${filterId})`;
    const isSafari =
      /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    setSupportsSvgFilter(
      probe.style.backdropFilter !== "" && !isSafari && !isFirefox,
    );
  }, [filterId]);

  const style: GlassStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    "--glass-background-opacity": backgroundOpacity,
    "--glass-depth-shadow-alpha": 0.04 + depthFactor * 0.04,
    "--glass-edge-alpha": 0.2 + depthFactor * 0.22,
    "--glass-filter": `url(#${filterId})`,
    "--glass-frost-blur": `${clamp(frost, 0, 40)}px`,
    "--glass-light-alpha": lightAlpha,
    "--glass-light-angle": `${lightAngle}deg`,
    "--glass-light-mid-alpha": lightMidAlpha,
    "--glass-light-midpoint": `${Math.round(splayValue * 0.48)}%`,
    "--glass-light-opposite-angle": `${lightAngle + 180}deg`,
    "--glass-light-rim-alpha": lightRimAlpha,
    "--glass-light-splay": `${splayValue}%`,
    "--glass-saturation": saturation,
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "liquid-glass",
        supportsSvgFilter
          ? "liquid-glass--svg"
          : "liquid-glass--fallback",
        className,
      )}
      style={style}
    >
      <svg
        className="liquid-glass__filter"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feImage
              ref={mapRef}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              ref={redChannelRef}
              in="SourceGraphic"
              in2="map"
              result="displacedRed"
            />
            <feColorMatrix
              in="displacedRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />
            <feDisplacementMap
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              result="displacedGreen"
            />
            <feColorMatrix
              in="displacedGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />
            <feDisplacementMap
              ref={blueChannelRef}
              in="SourceGraphic"
              in2="map"
              result="displacedBlue"
            />
            <feColorMatrix
              in="displacedBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />
            <feBlend in="red" in2="green" mode="screen" result="redGreen" />
            <feBlend
              in="redGreen"
              in2="blue"
              mode="screen"
              result="displacedOutput"
            />
            <feGaussianBlur
              ref={outputBlurRef}
              in="displacedOutput"
              stdDeviation={0}
            />
          </filter>
        </defs>
      </svg>
      <div className="liquid-glass__content">{children}</div>
    </div>
  );
}
