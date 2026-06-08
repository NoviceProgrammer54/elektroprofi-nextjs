'use client';
import { useEffect, useState } from 'react';
import { getLogoOverrides } from '@/lib/logo-overrides';

interface PartnerLogoProps {
  name: string;
  logo?: string;
  variant?: 'color' | 'mono-light';
  className?: string;
}

export function PartnerLogo({ name, logo: staticLogo, variant: staticVariant = 'color', className }: PartnerLogoProps) {
  const [logo, setLogo]       = useState(staticLogo);
  const [variant, setVariant] = useState(staticVariant);
  const [errored, setErrored] = useState(false);

  // Load Supabase override (uses module-level cache — fetched only once)
  useEffect(() => {
    getLogoOverrides().then(overrides => {
      const ov = overrides.get(name);
      if (ov?.logo_url) {
        setLogo(ov.logo_url);
        setVariant(ov.logo_variant ?? 'color');
        setErrored(false);
      }
    });
  }, [name]);

  const showImage = Boolean(logo) && !errored;

  return (
    <div className={'flex h-20 w-full items-center justify-center px-3 ' + (className ?? '')}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={`Логотип ${name}`}
          referrerPolicy="no-referrer"
          onError={() => setErrored(true)}
          className={
            'max-h-12 w-auto max-w-full object-contain transition-all duration-200 group-hover:scale-[1.04] ' +
            (variant === 'mono-light'
              ? 'brightness-0 invert opacity-90'
              : 'opacity-90 group-hover:opacity-100')
          }
        />
      ) : (
        <span className="font-display text-base font-bold uppercase tracking-wider text-foreground/80 transition group-hover:text-primary text-center leading-tight">
          {name}
        </span>
      )}
    </div>
  );
}
