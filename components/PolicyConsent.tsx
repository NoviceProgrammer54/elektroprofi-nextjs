'use client';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { PolicyDialog } from '@/components/PolicyDialog';
import { privacyPolicy, responsibilityPolicy } from '@/lib/data/policies';
import { cn } from '@/lib/utils';

interface PolicyConsentProps {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  prefix?: string;
  className?: string;
  id?: string;
}

export function PolicyConsent({
  checked,
  onCheckedChange,
  prefix,
  className,
  id = 'policy-consent',
}: PolicyConsentProps) {
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openResp, setOpenResp] = useState(false);

  return (
    <>
      <label
        htmlFor={id}
        className={cn(
          'flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background/40 p-3 sm:p-4',
          className,
        )}
      >
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(v) => onCheckedChange(v === true)}
          className="mt-0.5"
        />
        <span className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {prefix ? `${prefix} ` : ''}
          Я ознакомлен(а) и согласен(а) с{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setOpenPrivacy(true);
            }}
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            Политикой конфиденциальности
          </button>{' '}
          и{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setOpenResp(true);
            }}
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            Политикой ответственности
          </button>
          .
        </span>
      </label>

      <PolicyDialog policy={privacyPolicy} open={openPrivacy} onOpenChange={setOpenPrivacy} />
      <PolicyDialog policy={responsibilityPolicy} open={openResp} onOpenChange={setOpenResp} />
    </>
  );
}
