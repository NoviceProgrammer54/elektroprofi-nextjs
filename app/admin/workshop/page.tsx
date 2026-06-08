'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { parseCover, setCoverPosition, getCoverPositionPercent } from '@/lib/cover-position';
import { FolderPlus, ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Category {
  id: string; section: 'knowledge' | 'media';
  title: string; title_kz: string | null;
  sort_order: number; deleted: boolean;
}
interface Article {
  id: string; category_id: string;
  title: string; title_kz: string | null;
  author: string | null; summary: string | null; summary_kz: string | null;
  cover_url: string | null; content: string | null; content_kz: string | null;
  published: boolean; sort_order: number;
}

const EMPTY_CAT: Category = { id: '', section: 'knowledge', title: '', title_kz: '', sort_order: 100, deleted: false };
const EMPTY_ART: Article = { id: '', category_id: '', title: '', title_kz: '', author: 'Команда ELEKTROPROFI', summary: '', summary_kz: '', cover_url: '', content: '', content_kz: '', published: true, sort_order: 100 };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[ё]/g,'e').replace(/[^a-z0-9а-я]+/gi,'-').replace(/^-+|-+$/g,'').slice(0,80);
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminWorkshopPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [arts, setArts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [editArt, setEditArt] = useState<Article | null>(null);
  const [tab, setTab] = useState<'knowledge' | 'media'>('knowledge');

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const [{ data: c }, { data: a }] = await Promise.all([
      supabase.from('workshop_categories').select('*').order('sort_order'),
      supabase.from('workshop_articles').select('*').order('sort_order'),
    ]);
    setCats((c ?? []) as Category[]);
    setArts((a ?? []) as Article[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const visibleCats = useMemo(() => cats.filter(c => c.section === tab && !c.deleted), [cats, tab]);
  const artsByCat = useMemo(() => {
    const m = new Map<string, Article[]>();
    for (const a of arts) { if (!m.has(a.category_id)) m.set(a.category_id, []); m.get(a.category_id)!.push(a); }
    return m;
  }, [arts]);

  async function deleteCat(id: string) {
    if (!confirm('Удалить категорию и все её статьи?')) return;
    const supabase = createClient();
    await supabase.from('workshop_categories').delete().eq('id', id);
    load();
  }
  async function deleteArt(id: string) {
    if (!confirm('Удалить статью?')) return;
    const supabase = createClient();
    await supabase.from('workshop_articles').delete().eq('id', id);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-white">Мастерская</h1>
        <div className="flex gap-2">
          <button onClick={() => setEditCat({ ...EMPTY_CAT, section: tab })}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5">
            <FolderPlus className="h-4 w-4" /> Новая категория
          </button>
          <button onClick={() => setEditArt({ ...EMPTY_ART, category_id: visibleCats[0]?.id ?? '' })}
            className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
            <Plus className="h-4 w-4" /> Новая статья
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {(['knowledge','media'] as const).map(s => (
          <button key={s} onClick={() => setTab(s)}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${tab===s ? 'border-blue-500/30 bg-blue-500/10 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>
            {s==='knowledge' ? 'База знаний' : 'Медиа'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500"><Loader2 className="h-5 w-5 animate-spin" /> Загрузка…</div>
      ) : (
        <div className="space-y-6">
          {visibleCats.map(c => {
            const list = artsByCat.get(c.id) ?? [];
            return (
              <section key={c.id} className="card-premium overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 p-4">
                  <div>
                    <h2 className="font-display text-xl text-white">{c.title}</h2>
                    <p className="text-xs text-gray-500">id: <code>{c.id}</code> · порядок: {c.sort_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <Btn onClick={() => setEditCat(c)}>Редактировать</Btn>
                    <Btn onClick={() => setEditArt({ ...EMPTY_ART, category_id: c.id, sort_order: (list[list.length-1]?.sort_order ?? 0)+10 })}>
                      <Plus className="mr-1 h-3 w-3 inline" /> Статья
                    </Btn>
                    <button type="button" onClick={() => deleteCat(c.id)}
                      className="rounded-md p-1.5 text-red-400 hover:bg-red-500/10 transition"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                {list.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">Пока нет статей.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-left">
                        <th className="px-3 py-2 text-xs uppercase text-gray-500">№</th>
                        <th className="px-3 py-2 text-xs uppercase text-gray-500">Обложка</th>
                        <th className="px-3 py-2 text-xs uppercase text-gray-500">Заголовок</th>
                        <th className="px-3 py-2 text-xs uppercase text-gray-500">Автор</th>
                        <th className="px-3 py-2 text-xs uppercase text-gray-500">Статус</th>
                        <th className="px-3 py-2 text-xs uppercase text-gray-500"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map(a => {
                        const cov = parseCover(a.cover_url);
                        return (
                          <tr key={a.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                            <td className="px-3 py-2 text-gray-500">{a.sort_order}</td>
                            <td className="px-3 py-2">
                              {cov.src ? (
                                <div className="h-14 w-12 rounded border border-white/10"
                                  style={{ backgroundImage:`url(${cov.src})`, backgroundSize:'cover', backgroundPosition:cov.position }} />
                              ) : (
                                <div className="grid h-14 w-12 place-items-center rounded border border-dashed border-white/10 text-[10px] text-gray-600">нет</div>
                              )}
                            </td>
                            <td className="px-3 py-2 text-white">{a.title}</td>
                            <td className="px-3 py-2 text-gray-400">{a.author ?? '—'}</td>
                            <td className="px-3 py-2">
                              <span className={`rounded-full px-2 py-0.5 text-xs ${a.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-gray-500'}`}>
                                {a.published ? 'опубликовано' : 'черновик'}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right whitespace-nowrap">
                              <Btn onClick={() => setEditArt(a)}>Редактировать</Btn>
                              <button type="button" onClick={() => deleteArt(a.id)}
                                className="ml-1 rounded-md p-1.5 text-red-400 hover:bg-red-500/10 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </section>
            );
          })}
          {visibleCats.length === 0 && (
            <p className="text-gray-500 text-sm">Нет категорий. Создайте первую.</p>
          )}
        </div>
      )}

      {editCat && <CategoryForm initial={editCat} onClose={() => setEditCat(null)} onSaved={() => { setEditCat(null); load(); }} />}
      {editArt && <ArticleForm initial={editArt} categories={cats.filter(c=>!c.deleted)} onClose={() => setEditArt(null)} onSaved={() => { setEditArt(null); load(); }} />}
    </div>
  );
}

function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-gray-400 transition hover:bg-white/5 hover:text-white">{children}</button>;
}

// ─── Category form ────────────────────────────────────────────────────────────

function CategoryForm({ initial, onClose, onSaved }: { initial: Category; onClose: () => void; onSaved: () => void }) {
  const isNew = !initial.id;
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  function patch<K extends keyof Category>(k: K, v: Category[K]) { setF(s => ({...s,[k]:v})); }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setErr(null);
    try {
      const supabase = createClient();
      const id = isNew ? (f.id || slugify(f.title) || `cat-${Date.now()}`) : f.id;
      const { error } = await supabase.from('workshop_categories').upsert({ ...f, id, title_kz: f.title_kz||null }, { onConflict: 'id' });
      if (error) throw error; onSaved();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Ошибка'); }
    finally { setSaving(false); }
  }

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-display text-xl">{isNew ? 'Новая категория' : 'Категория'}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          {err && <p className="text-sm text-red-400">{err}</p>}
          {isNew && <F label="ID (slug)"><input value={f.id} onChange={e => patch('id',e.target.value)} placeholder="автогенерация из заголовка" className={inp} /></F>}
          <F label="Раздел">
            <Sel value={f.section} onChange={v => patch('section', v as Category['section'])}>
              <option value="knowledge">База знаний</option>
              <option value="media">Медиа</option>
            </Sel>
          </F>
          <F label="Заголовок (RU) *"><input required value={f.title} onChange={e => patch('title',e.target.value)} className={inp} /></F>
          <F label="Заголовок (KZ)"><input value={f.title_kz??''} onChange={e => patch('title_kz',e.target.value)} className={inp} /></F>
          <F label="Порядок сортировки"><input type="number" value={f.sort_order} onChange={e => patch('sort_order',Number(e.target.value))} className={inp} /></F>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:bg-white/5">Отмена</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50">{saving?'Сохранение…':'Сохранить'}</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Article form ─────────────────────────────────────────────────────────────

function ArticleForm({ initial, categories, onClose, onSaved }: { initial: Article; categories: Category[]; onClose: () => void; onSaved: () => void }) {
  const isNew = !initial.id;
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [insertingRu, setInsertingRu] = useState(false);
  const [insertingKz, setInsertingKz] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ruRef = useRef<HTMLTextAreaElement | null>(null);
  const kzRef = useRef<HTMLTextAreaElement | null>(null);
  function patch<K extends keyof Article>(k: K, v: Article[K]) { setF(s => ({...s,[k]:v})); }

  async function uploadImage(file: File): Promise<string> {
    const supabase = createClient();
    const ext = (file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');
    const safe = (f.id||'article').toLowerCase().replace(/[^a-z0-9-_]/g,'-');
    const name = `${safe}/${Date.now()}-${Math.random().toString(36).slice(2,7)}.${ext||'jpg'}`;
    const { error } = await supabase.storage.from('event-photos').upload(name, file, { upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from('event-photos').getPublicUrl(name);
    return data.publicUrl;
  }

  async function uploadCover(file: File) {
    setUploading(true); setErr(null);
    try { patch('cover_url', await uploadImage(file)); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Ошибка загрузки'); }
    finally { setUploading(false); }
  }

  async function insertIntoContent(field: 'content'|'content_kz', ref: React.RefObject<HTMLTextAreaElement|null>, file: File) {
    const setFlag = field==='content' ? setInsertingRu : setInsertingKz;
    setFlag(true); setErr(null);
    try {
      const url = await uploadImage(file);
      const md = `\n\n![](${url})\n\n`;
      const current = (f[field] as string|null) ?? '';
      const ta = ref.current;
      if (ta && typeof ta.selectionStart === 'number') {
        const start = ta.selectionStart; const end = ta.selectionEnd;
        patch(field, current.slice(0,start)+md+current.slice(end));
        requestAnimationFrame(() => { ta.focus(); const pos = start+md.length; ta.setSelectionRange(pos,pos); });
      } else { patch(field, current+md); }
    } catch (e) { setErr(e instanceof Error ? e.message : 'Ошибка'); }
    finally { setFlag(false); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setErr(null);
    try {
      const supabase = createClient();
      if (!f.category_id) throw new Error('Выберите категорию');
      const id = isNew ? (f.id||slugify(f.title)||`art-${Date.now()}`) : f.id;
      const payload = { ...f, id, title_kz:f.title_kz||null, summary:f.summary||null, summary_kz:f.summary_kz||null, author:f.author||null, cover_url:f.cover_url||null, content:f.content||null, content_kz:f.content_kz||null };
      const { error } = await supabase.from('workshop_articles').upsert(payload, { onConflict: 'id' });
      if (error) throw error; onSaved();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Ошибка'); }
    finally { setSaving(false); }
  }

  // Cover focal picker
  const covPos = getCoverPositionPercent(f.cover_url);
  const [dragging, setDragging] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  function applyFocal(clientX: number, clientY: number) {
    const el = pickerRef.current; if (!el || !f.cover_url) return;
    const r = el.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(100, ((clientX-r.left)/r.width)*100)));
    const y = Math.round(Math.max(0, Math.min(100, ((clientY-r.top)/r.height)*100)));
    patch('cover_url', setCoverPosition(f.cover_url, x, y));
  }

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display text-xl">{isNew ? 'Новая статья' : 'Редактирование статьи'}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {err && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{err}</p>}

          <div className="grid grid-cols-2 gap-3">
            {isNew && <div className="col-span-2"><F label="ID (slug)"><input value={f.id} onChange={e => patch('id',e.target.value)} placeholder="автогенерация из заголовка" className={inp} /></F></div>}
            <div className="col-span-2">
              <F label="Категория *">
                <select required value={f.category_id} onChange={e => patch('category_id',e.target.value)} className={sel}>
                  <option value="">— выберите —</option>
                  <optgroup label="База знаний">{categories.filter(c=>c.section==='knowledge').map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</optgroup>
                  <optgroup label="Медиа">{categories.filter(c=>c.section==='media').map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</optgroup>
                </select>
              </F>
            </div>
            <div className="col-span-2"><F label="Заголовок (RU) *"><input required value={f.title} onChange={e => patch('title',e.target.value)} className={inp} /></F></div>
            <div className="col-span-2"><F label="Заголовок (KZ)"><input value={f.title_kz??''} onChange={e => patch('title_kz',e.target.value)} className={inp} /></F></div>
            <F label="Автор"><input value={f.author??''} onChange={e => patch('author',e.target.value)} className={inp} /></F>
            <F label="Порядок"><input type="number" value={f.sort_order} onChange={e => patch('sort_order',Number(e.target.value))} className={inp} /></F>
            <div className="col-span-2"><F label="Краткое описание (RU)"><textarea rows={2} value={f.summary??''} onChange={e => patch('summary',e.target.value)} className={ta} /></F></div>
            <div className="col-span-2"><F label="Краткое описание (KZ)"><textarea rows={2} value={f.summary_kz??''} onChange={e => patch('summary_kz',e.target.value)} className={ta} /></F></div>
            <div className="col-span-2">
              <F label="Обложка">
                <div className="flex items-center gap-2">
                  <input value={f.cover_url??''} onChange={e => patch('cover_url',e.target.value)} placeholder="URL обложки" className={inp} />
                  <label className={`cursor-pointer text-sm text-blue-400 hover:text-blue-300 whitespace-nowrap ${uploading?'opacity-50':''}`}>
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadCover(e.target.files[0])} disabled={uploading} />
                    {uploading?'Загрузка…':'Загрузить'}
                  </label>
                </div>
                {f.cover_url && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Кликните на фото чтобы задать точку фокуса</p>
                    <div ref={pickerRef} className="relative h-40 w-full cursor-crosshair overflow-hidden rounded-lg"
                      style={{ backgroundImage:`url(${parseCover(f.cover_url).src})`, backgroundSize:'cover', backgroundPosition:'center' }}
                      onMouseDown={e => { setDragging(true); applyFocal(e.clientX,e.clientY); }}
                      onMouseMove={e => { if(dragging) applyFocal(e.clientX,e.clientY); }}
                      onMouseUp={() => setDragging(false)}
                      onMouseLeave={() => setDragging(false)}>
                      <div className="absolute rounded-full bg-blue-500 ring-2 ring-white shadow-lg pointer-events-none"
                        style={{ left:`${covPos.x}%`, top:`${covPos.y}%`, width:12, height:12, transform:'translate(-50%,-50%)' }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Позиция: {covPos.x}% {covPos.y}%</p>
                  </div>
                )}
              </F>
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className="text-xs font-medium text-gray-400">Контент (RU) — markdown</label>
                <label className={`inline-flex cursor-pointer items-center gap-1 text-xs text-blue-400 hover:text-blue-300 ${insertingRu?'opacity-50':''}`}>
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f2=e.target.files?.[0]; if(f2) insertIntoContent('content',ruRef,f2); e.target.value=''; }} disabled={insertingRu} />
                  <ImagePlus className="h-3 w-3" />{insertingRu?'Загрузка…':'Вставить фото'}
                </label>
              </div>
              <textarea ref={ruRef} rows={12} value={f.content??''} onChange={e => patch('content',e.target.value)} className={ta} />
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className="text-xs font-medium text-gray-400">Контент (KZ)</label>
                <label className={`inline-flex cursor-pointer items-center gap-1 text-xs text-blue-400 hover:text-blue-300 ${insertingKz?'opacity-50':''}`}>
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f2=e.target.files?.[0]; if(f2) insertIntoContent('content_kz',kzRef,f2); e.target.value=''; }} disabled={insertingKz} />
                  <ImagePlus className="h-3 w-3" />{insertingKz?'Загрузка…':'Вставить фото'}
                </label>
              </div>
              <textarea ref={kzRef} rows={10} value={f.content_kz??''} onChange={e => patch('content_kz',e.target.value)} className={ta} />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input id="published" type="checkbox" checked={f.published} onChange={e => patch('published',e.target.checked)} className="h-5 w-5 accent-blue-500" />
              <label htmlFor="published" className="text-sm text-gray-300">Опубликовано</label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:bg-white/5">Отмена</button>
            <button type="submit" disabled={saving||uploading} className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50">{saving?'Сохранение…':'Сохранить'}</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const inp = 'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50';
const ta  = 'w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50';
const sel = 'w-full rounded-lg border border-white/10 bg-[#0a1220] px-3 py-2 text-sm text-gray-200 focus:outline-none';
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><label className="block text-xs font-medium text-gray-400">{label}</label>{children}</div>;
}
function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={e => onChange(e.target.value)} className={sel}>{children}</select>;
}
