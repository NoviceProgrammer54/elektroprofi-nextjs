'use client';
import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Simple CSS-scroll carousel matching the shadcn Carousel API ── */

interface CarouselOptions {
  loop?: boolean;
  align?: string;
}

interface CarouselContextValue {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const CarouselContext = React.createContext<CarouselContextValue>({
  scrollPrev: () => {},
  scrollNext: () => {},
  canScrollPrev: false,
  canScrollNext: false,
});

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
}

function Carousel({ className, children, opts: _opts, ...props }: CarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scrollPrev = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -(el.clientWidth * 0.85), behavior: 'smooth' });
  }, []);

  const scrollNext = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.85, behavior: 'smooth' });
  }, []);

  return (
    <CarouselContext.Provider value={{ scrollPrev, scrollNext, canScrollPrev, canScrollNext }}>
      <div
        className={cn('relative', className)}
        {...props}
        data-carousel-root
      >
        {/* Pass the scroll ref via data attribute — CarouselContent reads it */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.type as { displayName?: string })?.displayName === 'CarouselContent') {
            return React.cloneElement(child as React.ReactElement<{ _scrollRef?: React.RefObject<HTMLDivElement | null> }>, { _scrollRef: scrollRef });
          }
          return child;
        })}
      </div>
    </CarouselContext.Provider>
  );
}

interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  _scrollRef?: React.RefObject<HTMLDivElement | null>;
}

function CarouselContent({ className, _scrollRef, ...props }: CarouselContentProps) {
  return (
    <div
      ref={_scrollRef}
      className={cn('flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', className)}
      {...props}
    />
  );
}
(CarouselContent as { displayName?: string }).displayName = 'CarouselContent';

interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {}

function CarouselItem({ className, ...props }: CarouselItemProps) {
  return (
    <div
      className={cn('snap-start shrink-0', className)}
      {...props}
    />
  );
}

function CarouselPrevious({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollPrev, canScrollPrev } = React.useContext(CarouselContext);
  return (
    <button
      type="button"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      aria-label="Previous slide"
      className={cn(
        'absolute top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow',
        'disabled:opacity-30 hover:bg-background transition',
        className,
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  );
}

function CarouselNext({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollNext, canScrollNext } = React.useContext(CarouselContext);
  return (
    <button
      type="button"
      onClick={scrollNext}
      disabled={!canScrollNext}
      aria-label="Next slide"
      className={cn(
        'absolute top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow',
        'disabled:opacity-30 hover:bg-background transition',
        className,
      )}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  );
}

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
