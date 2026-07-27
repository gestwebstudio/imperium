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

type Channel = "R" | "G" | "B";

type GlassSurfaceProps = {
  children: ReactNode;
  className?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  frostBlur?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: Channel;
  yChannel?: Channel;
};

type GlassStyle = CSSProperties & {
  "--glass-background-opacity": number;
  "--glass-filter": string;
  "--glass-frost-blur": string;
  "--glass-saturation": number;
};

export function GlassSurface({
  children,
  className,
  width = "100%",
  height = 78,
  borderRadius = 50,
  borderWidth = 0.055,
  brightness = 42,
  opacity = 0.64,
  blur = 3,
  displace = 0.35,
  frostBlur = 14,
  backgroundOpacity = 0.12,
  saturation = 1.18,
  distortionScale = -24,
  redOffset = -2,
  greenOffset = 0,
  blueOffset = 2,
  xChannel = "R",
  yChannel = "G",
}: GlassSurfaceProps) {
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
          <rect x="${edgeSize}" y="${edgeSize}" width="${innerWidth}" height="${innerHeight}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)"/>
        </svg>
      `;

      mapRef.current?.setAttribute(
        "href",
        `data:image/svg+xml,${encodeURIComponent(map)}`,
      );
    }

    const channels = [
      [redChannelRef, redOffset],
      [greenChannelRef, greenOffset],
      [blueChannelRef, blueOffset],
    ] as const;

    channels.forEach(([ref, offset]) => {
      ref.current?.setAttribute("scale", String(distortionScale + offset));
      ref.current?.setAttribute("xChannelSelector", xChannel);
      ref.current?.setAttribute("yChannelSelector", yChannel);
    });
    outputBlurRef.current?.setAttribute("stdDeviation", String(displace));

    const resizeObserver = new ResizeObserver(() => updateFilter(container));
    resizeObserver.observe(container);
    updateFilter(container);

    return () => resizeObserver.disconnect();
  }, [
    blueGradientId,
    blueOffset,
    blur,
    borderRadius,
    borderWidth,
    brightness,
    displace,
    distortionScale,
    greenOffset,
    opacity,
    redGradientId,
    redOffset,
    xChannel,
    yChannel,
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
    "--glass-filter": `url(#${filterId})`,
    "--glass-frost-blur": `${frostBlur}px`,
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
              stdDeviation={displace}
            />
          </filter>
        </defs>
      </svg>
      <div className="liquid-glass__content">{children}</div>
    </div>
  );
}
