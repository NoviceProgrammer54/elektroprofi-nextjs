'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { CheckCircle2, MessageCircle, Sparkles, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useT, useLang, useTT } from '@/lib/i18n/useT';
import { contacts } from '@/lib/data/contacts';
import { PolicyConsent } from '@/components/PolicyConsent';
import { useSearchParams } from 'next/navigation';

const schema = z.object({
  category: z.enum(['electrician','partner','client','student']),
  fullName: z.string().trim().min(2,'Минимум 2 символа').max(120),
  phone: z.string().trim().min(7,'Введите телефон').max(32),
  city: z.string().trim().min(2,'Укажите город'),
  extra: z.string().trim().max(1000).optional(),
  consent: z.literal(true),
});
type FormData = z.infer<typeof schema>;

const CATEGORIES = [
  {value:'electrician',label:'Электрик / электромонтажник'},
  {value:'partner',label:'Партнёр (бизнес, медиа, образование)'},
  {value:'client',label:'Заказчик услуг / технический партнёр'},
  {value:'student',label:'Студент / начинающий специалист'},
] as const;

export default function JoinPage() {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams.get('role') as FormData['category'] | null;
  const [submitted, setSubmitted] = useState(false);
  const daniil = contacts.find(c => c.id === 'daniil');

  const {register, handleSubmit, setValue, watch, formState:{errors,isSubmitting}} = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: roleFromUrl ? {category: roleFromUrl as FormData['category']} : undefined,
  });
  const categoryValue = watch('category');

  useEffect(()=>{ if(roleFromUrl) setValue('category', roleFromUrl as FormData['category'], {shouldValidate:false}); },[roleFromUrl,setValue]);

  const onSubmit = async (data: FormData) => {
    const lines = [
      'Здравствуйте! Хочу вступить в сообщество ELEKTROPROFI.',
      `Категория: ${CATEGORIES.find(c=>c.value===data.category)?.label??data.category}`,
      `ФИО: ${data.fullName}`,`Телефон: ${data.phone}`,`Город: ${data.city}`,
      data.extra?`Дополнительно: ${data.extra}`:null,
    ].filter(Boolean) as string[];
    try {
      const res = await fetch('/api/send-whatsapp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:lines.join('\n')})});
      const result = await res.json();
      if(!result?.ok){toast.error('Не удалось отправить. Попробуйте ещё раз.');return;}
    } catch {toast.error('Ошибка. Попробуйте ещё раз.');return;}
    toast.success(t('form.success'));
    setSubmitted(true);
  };

  if(submitted) return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary/15 ring-4 ring-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
      <h1 className="font-display text-2xl sm:text-3xl">{t('join.submitted.h')}</h1>
      <p className="mt-3 text-muted-foreground">{t('join.submitted.lead')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={`/${langQuery}`} className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-primary/10">{t('join.backHome')}</Link>
        {daniil && <a href={daniil.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-primary/10"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}
      </div>
    </div>
  );

  return (
    <div className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> {t('join.badge')}</span>
          <h1 className="page-title mt-5">{t('join.heroTitle')}</h1>
          <p className="page-lead">{t('join.heroLead')}</p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <section className="card-premium card-highlight relative overflow-hidden p-6 sm:p-8">
          <h2 className="mb-5 font-display text-xl">{t('join.form.title')}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
            <div className="grid gap-1.5">
              <Label htmlFor="category">{t('join.form.category')} *</Label>
              <select id="category" {...register('category')} className="flex h-10 w-full rounded-xl border border-input bg-background/40 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                <option value="">{t('join.form.categoryPlaceholder')}</option>
                {CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {errors.category && <span className="text-xs text-destructive">{t('join.err.required')}</span>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="fullName">{t('join.form.fullName')} *</Label>
              <Input id="fullName" placeholder={t('join.form.fullNamePlaceholder')} {...register('fullName')} aria-invalid={!!errors.fullName} />
              {errors.fullName && <span className="text-xs text-destructive">{errors.fullName.message}</span>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="phone">{t('join.form.phone')} *</Label>
                <Input id="phone" type="tel" {...register('phone')} aria-invalid={!!errors.phone} />
                {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="city">{t('join.form.city')} *</Label>
                <Input id="city" placeholder={t('join.form.cityPlaceholder')} {...register('city')} aria-invalid={!!errors.city} />
                {errors.city && <span className="text-xs text-destructive">{errors.city.message}</span>}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="extra">{t('join.form.extra')}</Label>
              <Textarea id="extra" rows={3} placeholder={t('join.form.extraPlaceholder')} {...register('extra')} />
            </div>
            <PolicyConsent checked={watch('consent') === true} onCheckedChange={v=>setValue('consent',v as true,{shouldValidate:true})} />
            {errors.consent && <span className="text-xs text-destructive">Необходимо согласие с политиками</span>}
            <Button type="submit" disabled={isSubmitting} className="font-bold" style={{background:'var(--gradient-accent)',color:'var(--primary-foreground)'}}>
              {isSubmitting ? t('join.submitting') : t('join.submitBtn')}
            </Button>
          </form>
        </section>

        {/* Sidebar benefits */}
        <aside className="space-y-4">
          <div className="card-premium p-5">
            <h3 className="font-display text-lg">{t('join.benefits.title')}</h3>
            <ul className="mt-4 space-y-2.5">
              {[t('join.benefit.access'),t('join.benefit.events'),t('join.benefit.champ'),t('join.benefit.partner'),t('join.benefit.orders')].map(b=><li key={b} className="flex items-start gap-2 text-sm"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /><span>{b}</span></li>)}
            </ul>
          </div>
          <div className="card-premium p-5">
            <h3 className="font-display text-lg">{t('join.cta.aside.h')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('join.cta.aside.text')}</p>
            {daniil && <a href={daniil.whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:border-primary/40 hover:bg-primary/10"><MessageCircle className="h-4 w-4" />{t('join.cta.aside.btn')}</a>}
          </div>
        </aside>
      </div>
    </div>
  );
}
