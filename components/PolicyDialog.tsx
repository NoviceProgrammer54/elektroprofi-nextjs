'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Policy } from '@/lib/data/policies';
import { useTT } from '@/lib/i18n/useT';

interface PolicyDialogProps {
  policy: Policy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PolicyDialog({ policy, open, onOpenChange }: PolicyDialogProps) {
  const tt = useTT();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl sm:text-2xl">{tt(policy.title)}</DialogTitle>
          {policy.meta.length > 0 && (
            <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
              {policy.meta.map((m) => (
                <span key={m} className="block">
                  {tt(m)}
                </span>
              ))}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-2 space-y-6 text-sm leading-relaxed text-foreground/90">
          {policy.intro?.map((b, idx) => (
            <p key={`intro-${idx}`} className="text-muted-foreground">
              {b.text}
            </p>
          ))}

          {policy.sections.map((section) => (
            <section key={section.title}>
              <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">
                {tt(section.title)}
              </h3>
              <div className="mt-2 space-y-2">
                {section.blocks.map((b, i) =>
                  b.list ? (
                    <ul key={`l-${i}`} className="ml-1 space-y-1.5 text-muted-foreground">
                      {b.list.map((li) => (
                        <li key={li} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                          <span>{tt(li)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p key={`p-${i}`} className="text-muted-foreground">
                      {tt(b.text ?? '')}
                    </p>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
