import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variant === 'default' &&
          'border-primary/40 bg-primary/15 text-primary',
        variant === 'secondary' &&
          'border-border bg-secondary text-secondary-foreground',
        variant === 'outline' &&
          'border-border bg-transparent text-foreground',
        variant === 'destructive' &&
          'border-destructive/40 bg-destructive/15 text-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
