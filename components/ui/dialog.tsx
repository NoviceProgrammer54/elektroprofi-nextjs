'use client';
import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cn } from '@/lib/utils';

/* ─── Root ─────────────────────────────────────────────────────── */
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}
function Dialog({ open, onOpenChange, children, defaultOpen }: DialogProps) {
  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
    >
      {children}
    </BaseDialog.Root>
  );
}

/* ─── Trigger ───────────────────────────────────────────────────── */
interface DialogTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}
function DialogTrigger({ asChild, children, ...props }: DialogTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return (
      <BaseDialog.Trigger render={children as React.ReactElement} {...props} />
    );
  }
  return <BaseDialog.Trigger {...props}>{children}</BaseDialog.Trigger>;
}

/* ─── Portal / Overlay / Content ───────────────────────────────── */
interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity" />
      <BaseDialog.Popup
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
          'rounded-2xl border border-border bg-card p-6 shadow-2xl',
          'data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
          'transition-opacity',
          className,
        )}
        {...props}
      >
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

/* ─── Header / Title / Description / Footer ─────────────────────── */
function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5', className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <BaseDialog.Title
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    />
  );
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <BaseDialog.Description
      className={cn('text-sm text-muted-foreground', className)}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  );
}

function DialogClose({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <BaseDialog.Close
      className={cn('', className)}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </BaseDialog.Close>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
