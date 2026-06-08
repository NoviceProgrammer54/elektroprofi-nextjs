'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useT, useTT } from '@/lib/i18n/useT';

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  phone: z.string().min(7, 'Введите телефон'),
  city: z.string().min(2, 'Укажите город'),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function JoinForm({ mode = 'join' }: { mode?: 'join' | 'hire' }) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const header = mode === 'hire' ? '🔔 Заявка: нанять электрика' : '🤝 Заявка: вступить в сообщество';
    const lines = [header, `Имя: ${data.name}`, `Телефон: ${data.phone}`, `Город: ${data.city}`, data.message ? `Сообщение: ${data.message}` : null].filter(Boolean) as string[];
    try {
      const res = await fetch('/api/send-whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: lines.join('\n') }) });
      const result = await res.json();
      if (!result?.ok) { toast.error('Не удалось отправить. Попробуйте ещё раз.'); return; }
    } catch { toast.error('Не удалось отправить. Попробуйте ещё раз.'); return; }
    toast.success(t('form.success'));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="name">{t('form.name')} *</Label>
        <Input id="name" {...register('name')} aria-invalid={!!errors.name} />
        {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="phone">{t('form.phone')} *</Label>
        <Input id="phone" type="tel" {...register('phone')} aria-invalid={!!errors.phone} />
        {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
      </div>
      <div className="grid gap-1.5 sm:col-span-2">
        <Label htmlFor="city">{t('form.city')} *</Label>
        <Input id="city" {...register('city')} aria-invalid={!!errors.city} />
        {errors.city && <span className="text-xs text-destructive">{errors.city.message}</span>}
      </div>
      <div className="grid gap-1.5 sm:col-span-2">
        <Label htmlFor="message">{t('form.message')}</Label>
        <Textarea id="message" rows={4} {...register('message')} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={isSubmitting} className="font-bold" style={{ background: 'var(--gradient-accent)', color: 'var(--primary-foreground)' }}>
          {t('form.submit')}
        </Button>
      </div>
    </form>
  );
}
