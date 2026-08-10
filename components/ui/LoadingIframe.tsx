"use client";

import { Skeleton } from "@heroui/react";
import {
  useState,
  type IframeHTMLAttributes,
  type SyntheticEvent,
} from "react";
import { cn } from "@/lib/cn";

export type LoadingIframeProps = IframeHTMLAttributes<HTMLIFrameElement> & {
  containerClassName?: string;
};

/** Внешний iframe с геометрически стабильным HeroUI placeholder до onLoad. */
export function LoadingIframe({
  containerClassName,
  className,
  onLoad,
  title,
  ...props
}: LoadingIframeProps) {
  const [loaded, setLoaded] = useState(false);

  function handleLoad(event: SyntheticEvent<HTMLIFrameElement>) {
    setLoaded(true);
    onLoad?.(event);
  }

  return (
    <div
      className={cn("loading-iframe", loaded && "is-loaded", containerClassName)}
      aria-busy={!loaded}
    >
      {!loaded && (
        <Skeleton
          className="imperium-skeleton loading-iframe__skeleton"
          aria-hidden="true"
        />
      )}
      <iframe
        {...props}
        className={cn("loading-iframe__frame", className)}
        title={title}
        referrerPolicy={
          props.referrerPolicy ?? "strict-origin-when-cross-origin"
        }
        tabIndex={loaded ? props.tabIndex : -1}
        aria-hidden={!loaded || undefined}
        onLoad={handleLoad}
      />
    </div>
  );
}
