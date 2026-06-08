'use client';
import { ClipboardList, UserCheck, PhoneCall } from 'lucide-react';
import { HireWizard } from '@/components/HireWizard';
import { useT, useTT } from '@/lib/i18n/useT';

export default function HiringPage() {
  const t = useT();
  const tt = useTT();

  const steps = [
    { icon: ClipboardList, title: t('hire.how.1.title'), text: t('hire.how.1.text') },
    { icon: UserCheck, title: t('hire.how.2.title'), text: t('hire.how.2.text') },
    { icon: PhoneCall, title: t('hire.how.3.title'), text: t('hire.how.3.text') },
  ];

  return (
    <div className="page-stack">
      <header className="page-hero section-rise text-center sm:text-left">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <span className="eyebrow">{tt('Премиум-сервис')}</span>
          <h1 className="page-title mt-5">
            {t('cta.hire').split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-electric">{t('cta.hire').split(' ').slice(-1)[0]}</span>
          </h1>
          <p className="page-lead mx-auto sm:mx-0">
            {tt('Заполните короткую анкету — мы подберём проверенного мастера-резидента ELEKTROPROFI и свяжемся в течение 15–30 минут.')}
          </p>
        </div>
      </header>

      {/* Как это работает */}
      <section aria-labelledby="how-h">
        <span className="eyebrow">{t('hire.how.eyebrow')}</span>
        <h2 id="how-h" className="mt-3 font-display text-2xl sm:text-3xl">{t('hire.how.title')}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t('hire.how.lead')}</p>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="card-premium relative p-5">
              <span className="absolute -top-3 left-5 grid h-7 w-7 place-items-center rounded-full font-display text-xs text-primary-foreground" style={{ background: 'var(--gradient-accent)' }} aria-hidden>{i + 1}</span>
              <div className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground" style={{ background: 'var(--gradient-accent)' }}>
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg leading-tight">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="card-premium card-highlight relative overflow-hidden p-6 sm:p-10" style={{ backgroundImage: 'radial-gradient(800px 400px at 0% 0%, color-mix(in oklab, var(--primary) 10%, transparent), transparent 60%), radial-gradient(600px 400px at 100% 100%, color-mix(in oklab, var(--primary) 8%, transparent), transparent 60%)' }}>
        <HireWizard />
      </section>
    </div>
  );
}
