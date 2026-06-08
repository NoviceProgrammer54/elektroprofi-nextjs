'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

/* ── Simple native-select wrapper matching the shadcn API ── */

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  defaultValue?: string;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (v: string) => void;
}>({});

function Select({ value, onValueChange, children, defaultValue }: SelectProps) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

// SelectTrigger is only used as a visual wrapper; we delegate to a native select
// placed inside SelectContent via a hidden approach. We render just a styled
// container — the actual interactive element lives in SelectContent.
function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  return (
    <div
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background/40 px-3 py-2 text-sm',
        'cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50',
        className,
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-1" />
    </div>
  );
}

function SelectValue({ children, placeholder }: { children?: React.ReactNode; placeholder?: string }) {
  return <span>{children ?? placeholder}</span>;
}

interface SelectContentProps {
  children?: React.ReactNode;
  className?: string;
}

function SelectContent({ children }: SelectContentProps) {
  return <>{children}</>;
}

interface SelectItemProps {
  value: string;
  children?: React.ReactNode;
}

function SelectItem({ value, children }: SelectItemProps) {
  return <option value={value}>{children}</option>;
}

/* ─── Compound native-select that replaces the whole Select group ──
   Usage identical to shadcn: wrap <Select> around <SelectTrigger> + <SelectContent>
   but we render a native <select> that sits on top via positioning. */

/**
 * NativeSelect — drop-in for the Select/SelectTrigger/SelectContent/SelectItem pattern.
 * Renders a styled container with an absolutely-positioned native <select> on top.
 */
interface NativeSelectProps {
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
  children?: React.ReactNode; // SelectItem children
}

function NativeSelect({
  value,
  onValueChange,
  placeholder,
  className,
  'aria-label': ariaLabel,
  children,
}: NativeSelectProps) {
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background/40 px-3 py-2 text-sm pointer-events-none',
        )}
      >
        <span>{value || placeholder || ''}</span>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-1" />
      </div>
      <select
        value={value ?? ''}
        onChange={(e) => onValueChange?.(e.target.value)}
        aria-label={ariaLabel}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
    </div>
  );
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  NativeSelect,
};
