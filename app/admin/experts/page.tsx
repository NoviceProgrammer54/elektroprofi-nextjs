'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cities } from '@/lib/data/cities';
import {
  EXPERT_ROLES, EXPERT_SKILL_LEVELS, EXPERT_STATUSES,
  type ExpertRole, type ExpertSkillLevel, type ExpertStatus,
} from '@/lib/data/experts';
import {
  Briefcase, GraduationCap, Loader2, MapPin, Plus, ShieldCheck, User, Wrench,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ExpertRow {
  id: string;
  first_name: string;
  last_name: string;
  city_id: string;
  status: string;
  role: string | null;
  skill_level: string | null;
  specialization: string;
  description: string;
  experience_years: number | null;
  experience: string | null;
  education: string | null;
  permit_group: string | null;
  skills: string[];
  preferred_work_main: string[];
  preferred_work_extra: string[];
  payment_methods: string[];
  instagram: string | null;
  interests: string | null;
  hobbies: string | null;
  short_bio: string | null;
  photo_url: string | null;
  permit_document_url: string | null;
  education_document_url: string | null;
  is_published: boolean;
  sort_order: number;
}

const EMPTY: Omit<ExpertRow, 'id'> = {
  first_name: '', last_name: '', city_id: cities[0].id,
  status: 'Резидент', role: null, skill_level: null,
  specialization: '', description: '',
  experience_years: null, experience: null, education: null, permit_group: null,
  skills: [], preferred_work_main: [], preferred_work_extra: [], payment_methods: [],
  instagram: null, interests: null, hobbies: null, short_bio: null,
  photo_url: null, permit_document_url: null, education_document_url: null,
  is_published: true, sort_order: 0,
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminExpertsPage() {
  const [rows, setRows] = useState<ExpertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ExpertRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState<ExpertRow | null>(null);
  const [filterCity, setFilterCity] = useState('all');

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('experts')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(1000);
    if (!error && data) setRows(data as ExpertRow[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function togglePublish(r: ExpertRow) {
    const supabase = createClient();
    await supabase.from('experts').update({ is_published: !r.is_published }).eq('id', r.id);
    load();
  }

  async function remove(r: ExpertRow) {
    if (!confirm(`Удалить «${r.first_name} ${r.last_name}»?`)) return;
    const supabase = createClient();
    await supabase.from('experts').delete().eq('id', r.id);
    load();
  }

  const filtered = useMemo(
    () => filterCity === 'all' ? rows : rows.filter(r => r.city_id === filterCity),
    [rows, filterCity],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-white">Электрики</h1>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-200"
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
          >
            <option value="all">Все города</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" /> Новый электрик
          </button>
        </div>
      </div>

      {showForm && (
        <ExpertForm
          initial={editing ?? ({ id: '', ...EMPTY } as ExpertRow)}
          isNew={!editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Загрузка…
        </div>
      ) : (
        <div className="card-premium overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Фото</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Имя</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Город</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Статус</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Опыт</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Публ.</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-3 py-2">
                    {r.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.photo_url} alt="" className="h-12 w-12 rounded-lg object-cover object-top" />
                    ) : (
                      <div className="grid h-12 w-12 place-items-center rounded-lg bg-white/5 text-gray-500">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 font-medium text-white">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-3 py-2 text-gray-400">
                    {cities.find(c => c.id === r.city_id)?.name ?? r.city_id}
                  </td>
                  <td className="px-3 py-2 text-gray-400">{r.status}</td>
                  <td className="px-3 py-2 text-gray-400">{r.experience_years ?? '—'}</td>
                  <td className="px-3 py-2">
                    <span className={r.is_published ? 'text-emerald-400' : 'text-gray-600'}>
                      {r.is_published ? 'да' : 'нет'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <Btn onClick={() => setPreview(r)}>Превью</Btn>
                      <Btn onClick={() => { setEditing(r); setShowForm(true); }}>Изм.</Btn>
                      <Btn onClick={() => togglePublish(r)}>
                        {r.is_published ? 'Скрыть' : 'Опубл.'}
                      </Btn>
                      <Btn danger onClick={() => remove(r)}>×</Btn>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-500">Пусто</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {preview && <PreviewDialog row={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

// ─── Reusable button ──────────────────────────────────────────────────────────

function Btn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2 py-1 text-xs transition ${
        danger
          ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
          : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function ExpertForm({
  initial, isNew, onClose, onSaved,
}: { initial: ExpertRow; isNew: boolean; onClose: () => void; onSaved: () => void }) {
  const [r, setR] = useState<ExpertRow>({ ...initial, skills: initial.skills ?? [], preferred_work_main: initial.preferred_work_main ?? [], preferred_work_extra: initial.preferred_work_extra ?? [], payment_methods: initial.payment_methods ?? [] });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingEduDoc, setUploadingEduDoc] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function patch<K extends keyof ExpertRow>(k: K, v: ExpertRow[K]) {
    setR(prev => ({ ...prev, [k]: v }));
  }
  function listOf(v: string): string[] {
    return v.split('\n').map(s => s.trim()).filter(Boolean);
  }

  async function uploadFile(
    file: File, bucket: string, suffix: string,
    onDone: (url: string) => void, setFlag: (v: boolean) => void,
  ) {
    setFlag(true);
    setErr(null);
    try {
      const supabase = createClient();
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
      const base = (r.id || 'expert').toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      const name = `${base || 'expert'}-${suffix}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(name, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(name);
      onDone(data.publicUrl);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setFlag(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const supabase = createClient();
    const id = r.id || `${r.first_name}-${r.last_name}`.toLowerCase().replace(/[^a-z0-9а-яё-]+/gi, '-').replace(/^-+|-+$/g, '');
    const payload = { ...r, id };
    const res = isNew
      ? await supabase.from('experts').insert(payload)
      : await supabase.from('experts').update(payload).eq('id', initial.id);
    setSaving(false);
    if (res.error) { setErr(res.error.message); return; }
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-xl border border-white/10 bg-[#0e1827] p-5">
      <h2 className="font-display text-xl text-white">
        {isNew ? 'Новый электрик' : `Редактировать: ${initial.first_name} ${initial.last_name}`}
      </h2>

      {/* Идентификация */}
      <div className="grid gap-3 sm:grid-cols-2">
        <F label="Имя *">
          <input required value={r.first_name} onChange={e => patch('first_name', e.target.value)} className={inp} />
        </F>
        <F label="Фамилия *">
          <input required value={r.last_name} onChange={e => patch('last_name', e.target.value)} className={inp} />
        </F>
        <F label="ID (slug)">
          <input value={r.id} onChange={e => patch('id', e.target.value)} disabled={!isNew}
            placeholder="auto-generated" className={inp} />
        </F>
        <F label="Город *">
          <Sel value={r.city_id} onChange={v => patch('city_id', v)}>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Sel>
        </F>
        <F label="Статус *">
          <Sel value={r.status} onChange={v => patch('status', v)}>
            {EXPERT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </Sel>
        </F>
        <F label="Должность">
          <Sel value={r.role ?? ''} onChange={v => patch('role', v || null)}>
            <option value="">— нет —</option>
            {EXPERT_ROLES.map(s => <option key={s} value={s}>{s}</option>)}
          </Sel>
        </F>
        <F label="Уровень мастерства">
          <Sel value={r.skill_level ?? ''} onChange={v => patch('skill_level', v || null)}>
            <option value="">— нет —</option>
            {EXPERT_SKILL_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
          </Sel>
        </F>
        <F label="Стаж (лет)">
          <input type="number" value={r.experience_years ?? ''} className={inp}
            onChange={e => patch('experience_years', e.target.value ? Number(e.target.value) : null)} />
        </F>
      </div>

      {/* Фото */}
      <F label="Фотография">
        <div className="flex flex-wrap items-start gap-4">
          {r.photo_url
            ? <img src={r.photo_url} alt="" className="h-32 w-28 rounded-xl object-cover object-top" />  // eslint-disable-line @next/next/no-img-element
            : <div className="grid h-32 w-28 place-items-center rounded-xl bg-white/5 text-gray-500"><User className="h-8 w-8" /></div>
          }
          <div className="flex-1 space-y-2">
            <input type="file" accept="image/*" disabled={uploading} className={`${inp} file:mr-3 file:rounded file:border-0 file:bg-blue-500/20 file:px-3 file:py-1 file:text-xs file:text-blue-300`}
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, 'expert-photos', 'photo', url => patch('photo_url', url), setUploading); }} />
            <input placeholder="…или URL фото" value={r.photo_url ?? ''} className={inp}
              onChange={e => patch('photo_url', e.target.value || null)} />
            {uploading && <p className="text-xs text-gray-500">Загрузка фото…</p>}
            {r.photo_url && <button type="button" onClick={() => patch('photo_url', null)} className="text-xs text-red-400 hover:underline">Удалить фото</button>}
          </div>
        </div>
      </F>

      {/* Карточка */}
      <F label="Специализация (бейдж на карточке) *">
        <input required value={r.specialization} onChange={e => patch('specialization', e.target.value)} className={inp} />
      </F>
      <F label="Краткое описание (карточка) *">
        <textarea required rows={3} value={r.description} onChange={e => patch('description', e.target.value)} className={ta} />
      </F>

      {/* Профиль */}
      <div className="grid gap-3 sm:grid-cols-2">
        <F label="Опыт (текстом)">
          <input value={r.experience ?? ''} onChange={e => patch('experience', e.target.value || null)}
            placeholder="в электромонтаже с 2012 года" className={inp} />
        </F>
        <F label="Группа допуска">
          <input value={r.permit_group ?? ''} onChange={e => patch('permit_group', e.target.value || null)} className={inp} />
        </F>
      </div>

      {/* Документ группы допуска */}
      <DocUpload label="Документ о группе допуска (PDF/изображение)"
        url={r.permit_document_url} uploading={uploadingDoc}
        onFile={f => uploadFile(f, 'expert-documents', 'permit', url => patch('permit_document_url', url), setUploadingDoc)}
        onUrl={v => patch('permit_document_url', v)} onClear={() => patch('permit_document_url', null)} />

      <F label="Образование">
        <textarea rows={2} value={r.education ?? ''} onChange={e => patch('education', e.target.value || null)} className={ta} />
      </F>

      {/* Документ об образовании */}
      <DocUpload label="Документ об образовании (PDF/изображение)"
        url={r.education_document_url} uploading={uploadingEduDoc}
        onFile={f => uploadFile(f, 'expert-documents', 'edu', url => patch('education_document_url', url), setUploadingEduDoc)}
        onUrl={v => patch('education_document_url', v)} onClear={() => patch('education_document_url', null)} />

      <F label={`Навыки (${r.skills.length}) — каждая строка отдельный пункт`}>
        <textarea rows={4} value={r.skills.join('\n')} onChange={e => patch('skills', listOf(e.target.value))} className={ta} />
      </F>

      <div className="grid gap-3 sm:grid-cols-2">
        <F label="Основные виды работ (по строкам)">
          <textarea rows={3} value={r.preferred_work_main.join('\n')} onChange={e => patch('preferred_work_main', listOf(e.target.value))} className={ta} />
        </F>
        <F label="Дополнительные виды работ (по строкам)">
          <textarea rows={3} value={r.preferred_work_extra.join('\n')} onChange={e => patch('preferred_work_extra', listOf(e.target.value))} className={ta} />
        </F>
      </div>

      <F label="Способы оплаты (по строкам)">
        <textarea rows={2} value={r.payment_methods.join('\n')} onChange={e => patch('payment_methods', listOf(e.target.value))} className={ta} />
      </F>

      <div className="grid gap-3 sm:grid-cols-2">
        <F label="Instagram"><input value={r.instagram ?? ''} onChange={e => patch('instagram', e.target.value || null)} placeholder="@username" className={inp} /></F>
        <F label="Хобби"><input value={r.hobbies ?? ''} onChange={e => patch('hobbies', e.target.value || null)} className={inp} /></F>
      </div>

      <F label="Профессиональные интересы">
        <textarea rows={2} value={r.interests ?? ''} onChange={e => patch('interests', e.target.value || null)} className={ta} />
      </F>

      <F label="О себе (длинный текст для модалки)">
        <textarea rows={5} value={r.short_bio ?? ''} onChange={e => patch('short_bio', e.target.value || null)} className={ta} />
      </F>

      <div className="grid gap-3 sm:grid-cols-2">
        <F label="Порядок сортировки (меньше — выше)">
          <input type="number" value={r.sort_order} onChange={e => patch('sort_order', Number(e.target.value) || 0)} className={inp} />
        </F>
        <div className="flex items-end gap-2 pb-1">
          <input id="is_pub" type="checkbox" className="h-5 w-5 accent-blue-500"
            checked={r.is_published} onChange={e => patch('is_published', e.target.checked)} />
          <label htmlFor="is_pub" className="text-sm text-gray-300">Опубликовано на сайте</label>
        </div>
      </div>

      {err && <p className="text-sm text-red-400">{err}</p>}

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={saving || uploading}
          className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50">
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
        <button type="button" onClick={onClose}
          className="rounded-lg border border-white/10 px-5 py-2 text-sm text-gray-400 transition hover:bg-white/5">
          Отмена
        </button>
      </div>
    </form>
  );
}

// ─── Document upload helper ───────────────────────────────────────────────────

function DocUpload({ label, url, uploading, onFile, onUrl, onClear }: {
  label: string; url: string | null; uploading: boolean;
  onFile: (f: File) => void; onUrl: (v: string | null) => void; onClear: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
      <p className="text-sm font-medium text-gray-300">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        <input type="file" accept="application/pdf,image/*" disabled={uploading}
          className={`${inp} max-w-xs file:mr-3 file:rounded file:border-0 file:bg-blue-500/20 file:px-3 file:py-1 file:text-xs file:text-blue-300`}
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        {uploading && <p className="text-xs text-gray-500">Загрузка…</p>}
        {url && !uploading && (
          <>
            <a href={url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 underline-offset-2 hover:underline">Открыть</a>
            <button type="button" onClick={onClear} className="text-xs text-red-400 hover:underline">Удалить</button>
          </>
        )}
      </div>
      <input placeholder="…или вставьте прямую ссылку" value={url ?? ''} onChange={e => onUrl(e.target.value || null)} className={inp} />
    </div>
  );
}

// ─── Preview dialog ───────────────────────────────────────────────────────────

function PreviewDialog({ row, onClose }: { row: ExpertRow; onClose: () => void }) {
  const cityName = cities.find(c => c.id === row.city_id)?.name ?? row.city_id;
  const topSkills = (row.skills ?? []).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0e1827] p-6" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-white">Превью карточки</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Card preview */}
          <article className="card-premium card-glow group flex flex-col overflow-hidden p-0">
            <div className="relative aspect-[67/78] w-full overflow-hidden bg-surface">
              {row.photo_url
                ? <img src={row.photo_url} alt="" className="h-full w-full object-cover object-top" /> // eslint-disable-line @next/next/no-img-element
                : <div className="grid h-full w-full place-items-center text-primary-foreground" style={{ background: 'var(--gradient-accent)' }}><User className="h-16 w-16 opacity-80" /></div>
              }
              <span className="absolute left-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1 rounded-full border border-primary/40 bg-background/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur">
                <ShieldCheck className="h-3 w-3 shrink-0" />
                <span className="truncate">{row.status}</span>
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <h4 className="font-display text-lg leading-tight">{row.first_name} {row.last_name}</h4>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />{cityName}
                </div>
              </div>
              <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">{row.description}</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-300">
                  <Briefcase className="h-3 w-3" />{row.specialization}
                </span>
                {row.skill_level && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-300">{row.skill_level}</span>}
              </div>
              {topSkills.length > 0 && (
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {topSkills.map(s => <li key={s} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" /><span className="line-clamp-1">{s}</span></li>)}
                </ul>
              )}
              {row.experience_years != null && (
                <div className="mt-auto leading-tight">
                  <div className="font-display text-2xl text-primary">{row.experience_years}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">опыт · лет</div>
                </div>
              )}
            </div>
          </article>

          {/* Detail */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />{row.status}
            </div>
            <h3 className="font-display text-xl text-white">{row.first_name} {row.last_name}</h3>
            <p className="text-gray-400"><MapPin className="mr-1 inline h-3.5 w-3.5" />{cityName} {row.experience && `· ${row.experience}`}</p>
            {(row.education || row.permit_group) && (
              <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:grid-cols-2">
                {row.education && <div className="flex gap-2 text-gray-300"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><div className="text-[10px] uppercase text-gray-500">Образование</div>{row.education}</div></div>}
                {row.permit_group && <div className="flex gap-2 text-gray-300"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><div className="text-[10px] uppercase text-gray-500">Группа допуска</div>{row.permit_group}</div></div>}
              </div>
            )}
            {row.skills?.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-1 flex items-center gap-1 text-xs font-bold text-gray-400"><Wrench className="h-3.5 w-3.5" /> Навыки</div>
                <ul className="space-y-1 text-gray-300">{row.skills.map(s => <li key={s} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />{s}</li>)}</ul>
              </div>
            )}
            {row.short_bio && <p className="text-gray-400 italic">{row.short_bio}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Primitive helpers ────────────────────────────────────────────────────────

const inp = 'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 disabled:opacity-50';
const ta  = 'w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50';

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><label className="block text-xs font-medium text-gray-400">{label}</label>{children}</div>;
}
function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0a1220] px-3 py-2 text-sm text-gray-200 focus:outline-none">{children}</select>;
}
