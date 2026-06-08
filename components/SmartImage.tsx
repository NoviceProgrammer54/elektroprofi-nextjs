'use client';
import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SmartImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "loading" | "decoding"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  aspectRatio?: string;
  imgClassName?: string;
  fallback?: React.ReactNode;
  srcSet?: string;
  sizes?: string;
}

export function SmartImage({
  src,
  alt,
  width,
  height,
  priority = false,
  aspectRatio,
  className,
  imgClassName,
  fallback,
  srcSet,
  sizes,
  style,
  ...rest
}: SmartImageProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (priority || inView) return;
    const el = wrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority, inView]);

  const hasFrame = Boolean(
    aspectRatio || (width && height) || className?.includes("h-"),
  );

  const wrapStyle: React.CSSProperties = {
    aspectRatio:
      aspectRatio ?? (width && height ? `${width} / ${height}` : undefined),
    ...style,
  };

  if (errored && fallback) {
    return (
      <span
        ref={wrapRef}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden bg-surface",
          className,
        )}
        style={wrapStyle}
      >
        {fallback}
      </span>
    );
  }

  return (
    <span
      ref={wrapRef}
      className={cn(
        "relative inline-block overflow-hidden",
        hasFrame ? "bg-surface/40" : "bg-transparent",
        className,
      )}
      style={wrapStyle}
    >
      {inView && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            hasFrame ? "h-full w-full object-cover" : "max-h-full max-w-full",
            "transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
          {...rest}
        />
      )}
    </span>
  );
}
