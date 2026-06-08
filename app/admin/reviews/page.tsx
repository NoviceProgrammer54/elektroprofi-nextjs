'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus } from 'lucide-react';

type ReviewRole = 'guest' | 'client' | 'electrician' | 'partner';
type ReviewStatus = 'draft' | 'published';

interface ReviewRow {
  id: string;
  author_name: string;
  author_role: ReviewRole;
  rating: number;
  text: string;
  status: ReviewStatus;
  published_at: string | null;
  created_at: string;
}

const ROLES: ReviewRole[] = ['client', 'electrician', 'partner', 'guest'];
const ROLE_LABELS: Record<ReviewRole, string> = {
  client: 'Клиент', electrician: 'Электрик', partner: 'Партнёр', guest: 'Гость',
};

export default function AdminReviewsPage() {
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ReviewRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (!error && data) setRows(data as ReviewRow[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleStatus(r: ReviewRow) {
    const supabase = createClient();
    const next: ReviewStatus = r.status === 'published' ? 'draft' : 'published';
    await supabase.from('reviews').update({
      status: next,
      published_at: next === 'published' ? (r.published_at ?? new Date().toISOString()) : r.published_at,
    }).eq('id', r.id);
    load();
  }

  async function remove(r: ReviewRow) {
    if (!confirm(`Удалить отзыв от «${r.author_name}»?`)) return;
    const supabase = createClient();
    await supabase.from('reviews').delete().eq('id', r.id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-white">Отзывы</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" /> Новый отзыв
        </button>
      </div>

      {showForm && (
        <ReviewForm
          initial={editing}
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
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Автор</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Роль</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">★</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Текст</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Статус</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500">Дата</th>
                <th className="px-3 py-2 text-xs uppercase text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-3 py-2 font-medium text-white">{r.author_name}</td>
                  <td className="px-3 py-2 text-gray-400">{ROLE_LABELS[r.author_role] ?? r.author_role}</td>
                  <td className="px-3 py-2 text-amber-400">{r.rating}</td>
                  <td className="px-3 py-2 max-w-xs truncate text-gray-400" title={r.text}>{r.text}</td>
                  <td className="px-3 py-2">
                    <span className={r.status === 'published' ? 'text-emerald-400' : 'text-gray-600'}>
                      {r.status === 'published' ? 'опубликован' : 'черновик'}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {(r.published_at ?? r.created_at).slice(0, 10)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex gap-1">
                      <Btn onClick={() => { setEditing(r); setShowForm(true); }}>Изм.</Btn>
                      <Btn onClick={() => toggleStatus(r)}>
                        {r.status === 'published' ? 'Снять' : 'Опубл.'}
                      </Btn>
                      <Btn danger onClick={() => remove(r)}>×</Btn>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-500">Отзывов нет</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ReviewForm({ initial, onClose, onSaved }: {
  initial: ReviewRow | null; onClose: () => void; onSaved: () => void;
}) {
  const [authorName, setAuthorName] = useState(initial?.author_name ?? '');
  const [authorRole, setAuthorRole] = useState<ReviewRole>(initial?.author_role ?? 'client');
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [text, setText] = useState(initial?.text ?? '');
  const [status, setStatus] = useState<ReviewStatus>(initial?.status ?? 'draft');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const supabase = createClient();
    const payload = {
      author_name: authorName, author_role: authorRole,
      rating, text, status,
      published_at: status === 'published'
        ? (initial?.published_at ?? new Date().toISOString())
        : (initial?.published_at ?? null),
    };
    const res = initial
      ? await supabase.from('reviews').update(payload).eq('id', initial.id)
      : await supabase.from('reviews').insert(payload);
    setSaving(false);
    if (res.error) { setErr(res.error.message); return; }
    onSaved();
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-white/10 bg-[#0e1827] p-5">
      <h2 className="font-display text-xl text-white">{initial ? 'Редактировать отзыв' : 'Новый отзыв'}</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <F label="Автор *">
          <input required value={authorName} onChange={e => setAuthorName(e.target.value)} className={inp} />
        </F>
        <F label="Роль">
          <select value={authorRole} onChange={e => setAuthorRole(e.target.value as ReviewRole)} className={sel}>
            {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
        </F>
        <F label="Рейтинг (1–5)">
          <input type="number" min={1} max={5} required value={rating} onChange={e => setRating(Number(e.target.value))} className={inp} />
        </F>
        <F label="Статус">
          <select value={status} onChange={e => setStatus(e.target.value as ReviewStatus)} className={sel}>
            <option value="draft">черновик</option>
            <option value="published">опубликован</option>
          </select>
        </F>
      </div>

      <F label="Текст отзыва *">
        <textarea required rows={4} value={text} onChange={e => setText(e.target.value)} className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50" />
      </F>

      {err && <p className="text-sm text-red-400">{err}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={saving}
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

function Btn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-md border px-2 py-1 text-xs transition ${danger ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}>
      {children}
    </button>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><label className="block text-xs font-medium text-gray-400">{label}</label>{children}</div>;
}

const inp = 'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50';
const sel = 'w-full rounded-lg border border-white/10 bg-[#0a1220] px-3 py-2 text-sm text-gray-200 focus:outline-none';
