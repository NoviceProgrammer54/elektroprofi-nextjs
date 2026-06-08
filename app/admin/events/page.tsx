'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { events as baseEvents, type CalendarEvent, type EventKind } from '@/lib/data/events';
import { mergeEvents, type EventOverrideRow } from '@/lib/events-merge';
import { isPromo, PROMO_STYLES } from '@/lib/promo';
import { Calendar, Image as ImageIcon, Loader2, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'events' | 'promos';

interface FormState {
  id: string; is_custom: boolean;
  date: string; end_date: string;
  kind: '' | EventKind; cta_label: string; promo_style: string;
  city: string; city_kz: string;
  title: string; title_kz: string;
  brands: string; status: 'open' | 'limited' | 'invite';
  note: string; note_kz: string;
  description: string; description_kz: string;
  time: string; venue: string;
  image_url: string; image_alt: string;
  gallery: { src: string; alt?: string }[];
  multi_days: number;
}

function eventToForm(e: CalendarEvent, isCustom: boolean): FormState {
  return {
    id: e.id, is_custom: isCustom,
    date: e.date, end_date: e.endDate ?? '',
    kind: e.kind ?? '', cta_label: e.ctaLabel ?? '', promo_style: e.promoStyle ?? '',
    city: e.city, city_kz: e.cityKz ?? '',
    title: e.title, title_kz: e.titleKz ?? '',
    brands: (e.brands ?? []).join(', '), status: e.status,
    note: e.note ?? '', note_kz: e.noteKz ?? '',
    description: e.description ?? '', description_kz: e.descriptionKz ?? '',
    time: e.time ?? '', venue: e.venue ?? '',
    image_url: e.imageUrl ?? '', image_alt: e.imageAlt ?? '',
    gallery: e.gallery ?? [], multi_days: 1,
  };
}

function emptyForm(kind: '' | EventKind, id: string): FormState {
  return {
    id, is_custom: true,
    date: new Date().toISOString().slice(0, 10), end_date: '',
    kind, cta_label: kind ? 'Подробнее' : '', promo_style: '',
    city: 'Алматы', city_kz: '',
    title: '', title_kz: '',
    brands: 'ELEKTROPROFI', status: 'open',
    note: '', note_kz: '', description: '', description_kz: '',
    time: '', venue: '', image_url: '', image_alt: '',
    gallery: [], multi_days: 1,
  };
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso); d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminEventsPage() {
  const [overrides, setOverrides] = useState<EventOverrideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState<Tab>('events');
  const [editing, setEditing] = useState<FormState | null>(null);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('event_overrides').select('*').limit(2000);
    setOverrides((data ?? []) as unknown as EventOverrideRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const merged = useMemo(() => mergeEvents(baseEvents, overrides), [overrides]);
  const baseIds = useMemo(() => new Set(baseEvents.map(e => e.id)), []);
  const ovById  = useMemo(() => new Map(overrides.map(o => [o.id, o])), [overrides]);

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const byTab = merged.filter(e => tab === 'promos' ? isPromo(e) : !isPromo(e));
    if (!q) return byTab;
    return byTab.filter(e => e.title.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.date.includes(q));
  }, [merged, filter, tab]);

  async function resetOverride(id: string) {
    if (!confirm('Сбросить изменения и вернуть оригинал?')) return;
    const supabase = createClient();
    await supabase.from('event_overrides').delete().eq('id', id);
    load();
  }
  async function deleteCustom(id: string) {
    if (!confirm('Удалить это событие безвозвратно?')) return;
    const supabase = createClient();
    await supabase.from('event_overrides').delete().eq('id', id);
    load();
  }
  async function softDelete(id: string) {
    if (!confirm('Скрыть это событие с сайта?')) return;
    const supabase = createClient();
    await supabase.from('event_overrides').upsert({ id, is_custom: false, deleted: true }, { onConflict: 'id' });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl font-bold text-white">
            {tab === 'promos' ? 'Акции и конкурсы' : 'События'}
          </h1>
          <div className="inline-flex rounded-lg border border-white/10 p-0.5">
            {(['events','promos'] as Tab[]).map(t => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1 text-sm transition ${tab===t ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                {t === 'events' ? 'События' : 'Акции/Конкурсы'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Поиск…"
            className="h-9 w-64 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-200 focus:outline-none" />
          <button onClick={() => setEditing(emptyForm(tab === 'promos' ? 'promo' : '', `custom-${Date.now()}`))}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
            <Plus className="h-4 w-4" /> {tab === 'promos' ? 'Новая акция' : 'Новое событие'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500"><Loader2 className="h-5 w-5 animate-spin" /> Загрузка…</div>
      ) : (
        <div className="card-premium overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Обложка</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">{tab==='promos'?'Период':'Дата'}</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Город</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Название</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Тип</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map(e => {
                const isCustom = !baseIds.has(e.id);
                const hasOverride = ovById.has(e.id);
                return (
                  <tr key={e.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-3 py-2">
                      {e.imageUrl
                        ? <img src={e.imageUrl} alt="" className="h-12 w-16 rounded object-cover" /> // eslint-disable-line @next/next/no-img-element
                        : <div className="grid h-12 w-16 place-items-center rounded bg-white/5 text-gray-600"><ImageIcon className="h-4 w-4" /></div>
                      }
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-400">
                      <Calendar className="mr-1 inline h-3.5 w-3.5 text-gray-600" />
                      {e.date}{e.endDate && e.endDate !== e.date ? ` → ${e.endDate}` : ''}
                    </td>
                    <td className="px-3 py-2 text-gray-400">{e.city}</td>
                    <td className="px-3 py-2 text-white">{e.title}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${isCustom ? 'bg-blue-500/20 text-blue-300' : hasOverride ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-gray-400'}`}>
                        {isCustom ? 'своё' : hasOverride ? 'изменено' : 'базовое'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <Btn onClick={() => setEditing(eventToForm(e, isCustom))}>Редактировать</Btn>
                        {hasOverride && !isCustom && (
                          <button type="button" onClick={() => resetOverride(e.id)} title="Сбросить к оригиналу"
                            className="rounded-md p-1.5 text-gray-400 hover:bg-white/5 hover:text-white transition">
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {isCustom
                          ? <button type="button" onClick={() => deleteCustom(e.id)} className="rounded-md p-1.5 text-red-400 hover:bg-red-500/10 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                          : <button type="button" onClick={() => softDelete(e.id)} className="rounded-md p-1.5 text-gray-400 hover:bg-white/5 transition"><X className="h-3.5 w-3.5" /></button>
                        }
                      </div>
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-500">Пусто</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EventForm initial={editing} tab={tab}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}

// ─── Button helper ────────────────────────────────────────────────────────────

function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="rounded-md border border-white/10 px-2 py-1 text-xs text-gray-400 transition hover:bg-white/5 hover:text-white">
      {children}
    </button>
  );
}

// ─── Event form ───────────────────────────────────────────────────────────────

function EventForm({ initial, tab, onClose, onSaved }: {
  initial: FormState; tab: Tab; onClose: () => void; onSaved: () => void;
}) {
  const [f, setF] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const isPromoTab = tab === 'promos';
  const isNew = f.is_custom && initial.id.startsWith('custom-');
  const canBulk = !isPromoTab && isNew;

  function patch<K extends keyof FormState>(k: K, v: FormState[K]) {
    setF(s => ({ ...s, [k]: v }));
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setErr(null);
    try {
      const supabase = createClient();
      const newItems: { src: string }[] = [];
      for (const file of Array.from(files)) {
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
        const name = `${f.id.replace(/[^a-z0-9-]/g, '-')}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
        const { error } = await supabase.storage.from('event-photos').upload(name, file, { upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from('event-photos').getPublicUrl(name);
        newItems.push({ src: data.publicUrl });
      }
      const next = [...f.gallery, ...newItems];
      patch('gallery', next);
      if (!f.image_url && next[0]) patch('image_url', next[0].src);
    } catch (e) { setErr(e instanceof Error ? e.message : 'Ошибка загрузки'); }
    finally { setUploading(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr(null);
    try {
      const supabase = createClient();
      const brands = f.brands.split(',').map(s => s.trim()).filter(Boolean);
      const base = {
        is_custom: f.is_custom, deleted: false,
        city: f.city||null, city_kz: f.city_kz||null,
        title: f.title||null, title_kz: f.title_kz||null,
        brands: brands.length ? brands : null,
        status: f.status, kind: f.kind||null,
        cta_label: f.cta_label||null, promo_style: f.promo_style||null,
        note: f.note||null, note_kz: f.note_kz||null,
        description: f.description||null, description_kz: f.description_kz||null,
        time: f.time||null, venue: f.venue||null,
        image_url: f.image_url||null, image_alt: f.image_alt||null,
        gallery: f.gallery,
      };
      const days = canBulk ? Math.max(1, Math.min(60, f.multi_days)) : 1;
      if (days > 1) {
        const rows = Array.from({length:days}).map((_,i) => ({ ...base, id:`${f.id}-${i+1}`, date: addDays(f.date,i), end_date: null }));
        const { error } = await supabase.from('event_overrides').insert(rows);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('event_overrides').upsert({ ...base, id: f.id, date: f.date||null, end_date: f.end_date||null }, { onConflict: 'id' });
        if (error) throw error;
      }
      onSaved();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Ошибка'); }
    finally { setSaving(false); }
  }

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {f.is_custom ? (isPromoTab ? 'Новая акция' : 'Новое событие') : (isPromoTab ? 'Редактирование акции' : 'Редактирование события')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {err && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{err}</div>}

          {isPromoTab && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <F label="Тип">
                  <Sel value={f.kind||'promo'} onChange={v => patch('kind', v as EventKind)}>
                    <option value="promo">Акция</option>
                    <option value="championship">Конкурс</option>
                  </Sel>
                </F>
                <F label="Текст CTA-кнопки">
                  <input value={f.cta_label} onChange={e => patch('cta_label', e.target.value)} placeholder="Принять участие" className={inp} />
                </F>
              </div>
              <F label="Градиент маркера на календаре">
                <div className="mt-1 grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {PROMO_STYLES.map(s => (
                    <button key={s.id} type="button" onClick={() => patch('promo_style', s.id)}
                      className={`flex flex-col items-stretch gap-1 rounded-lg border p-1.5 text-left transition ${f.promo_style===s.id ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-white/10 bg-white/5'}`}>
                      <span className="h-5 w-full rounded" style={{background:s.swatch}} />
                      <span className="truncate text-[10px] text-gray-300">{s.label}</span>
                    </button>
                  ))}
                </div>
              </F>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <F label={isPromoTab ? 'Дата начала' : 'Дата'}>
              <input type="date" value={f.date} onChange={e => patch('date', e.target.value)} className={inp} />
            </F>
            <F label={isPromoTab ? 'Дата окончания' : 'Дата окончания (необязательно)'}>
              <input type="date" value={f.end_date} onChange={e => patch('end_date', e.target.value)} className={inp} />
            </F>
            {canBulk && (
              <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <F label="Создать серию на N дней подряд">
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} max={60} value={f.multi_days} onChange={e => patch('multi_days', Number(e.target.value)||1)} className={`${inp} w-24`} />
                    <span className="text-xs text-gray-500">
                      {f.multi_days>1 ? `Будет создано ${f.multi_days} событий с ${f.date} по ${addDays(f.date,f.multi_days-1)}` : '1 = одно событие'}
                    </span>
                  </div>
                </F>
              </div>
            )}
            <F label="Время"><input value={f.time} onChange={e => patch('time', e.target.value)} placeholder="14:00 – 18:00" className={inp} /></F>
            <F label="Статус">
              <Sel value={f.status} onChange={v => patch('status', v as FormState['status'])}>
                <option value="open">Открыто</option>
                <option value="limited">Ограничено</option>
                <option value="invite">По приглашению</option>
              </Sel>
            </F>
            <F label="Город (RU)"><input value={f.city} onChange={e => patch('city', e.target.value)} className={inp} /></F>
            <F label="Город (KZ)"><input value={f.city_kz} onChange={e => patch('city_kz', e.target.value)} className={inp} /></F>
            <div className="col-span-2"><F label="Название (RU)"><input value={f.title} onChange={e => patch('title', e.target.value)} className={inp} /></F></div>
            <div className="col-span-2"><F label="Название (KZ)"><input value={f.title_kz} onChange={e => patch('title_kz', e.target.value)} className={inp} /></F></div>
            <div className="col-span-2"><F label="Бренды (через запятую)"><input value={f.brands} onChange={e => patch('brands', e.target.value)} className={inp} /></F></div>
            <div className="col-span-2"><F label="Место (адрес)"><input value={f.venue} onChange={e => patch('venue', e.target.value)} className={inp} /></F></div>
            <div className="col-span-2"><F label="Заметка (RU)"><input value={f.note} onChange={e => patch('note', e.target.value)} className={inp} /></F></div>
            <div className="col-span-2"><F label="Заметка (KZ)"><input value={f.note_kz} onChange={e => patch('note_kz', e.target.value)} className={inp} /></F></div>
            <div className="col-span-2"><F label="Описание (RU)"><textarea rows={5} value={f.description} onChange={e => patch('description', e.target.value)} className={ta} /></F></div>
            <div className="col-span-2"><F label="Описание (KZ)"><textarea rows={4} value={f.description_kz} onChange={e => patch('description_kz', e.target.value)} className={ta} /></F></div>
          </div>

          {/* Gallery */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-300">Фотогалерея ({f.gallery.length})</p>
              <label className={`cursor-pointer text-sm text-blue-400 hover:text-blue-300 ${uploading ? 'opacity-50' : ''}`}>
                <input type="file" accept="image/*" multiple className="hidden" onChange={e => uploadFiles(e.target.files)} disabled={uploading} />
                {uploading ? 'Загрузка…' : '+ Добавить фото'}
              </label>
            </div>
            {f.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {f.gallery.map((g,i) => (
                  <div key={i} className="group relative">
                    <img src={g.src} alt="" className="h-20 w-full rounded object-cover" /> {/* eslint-disable-line @next/next/no-img-element */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 rounded bg-black/0 opacity-0 transition group-hover:bg-black/50 group-hover:opacity-100">
                      <button type="button" onClick={() => { const n=[...f.gallery]; if(i>0){[n[i-1],n[i]]=[n[i],n[i-1]]; patch('gallery',n);} }} className="rounded bg-white/90 px-1.5 text-xs text-black">←</button>
                      <button type="button" onClick={() => { const n=[...f.gallery]; if(i<n.length-1){[n[i],n[i+1]]=[n[i+1],n[i]]; patch('gallery',n);} }} className="rounded bg-white/90 px-1.5 text-xs text-black">→</button>
                      <button type="button" onClick={() => patch('gallery', f.gallery.filter((_,j)=>j!==i))} className="rounded bg-red-500 px-1.5 text-xs text-white">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <F label="URL обложки"><input value={f.image_url} onChange={e => patch('image_url', e.target.value)} placeholder="https://… или из галереи" className={inp} /></F>
              <F label="Alt обложки"><input value={f.image_alt} onChange={e => patch('image_alt', e.target.value)} className={inp} /></F>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5">Отмена</button>
            <button type="submit" disabled={saving||uploading} className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50">
              {saving ? 'Сохранение…' : 'Сохранить'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const inp = 'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50';
const ta  = 'w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50';
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><label className="block text-xs font-medium text-gray-400">{label}</label>{children}</div>;
}
function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0a1220] px-3 py-2 text-sm text-gray-200 focus:outline-none">{children}</select>;
}
