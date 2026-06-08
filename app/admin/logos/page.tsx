'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { partnerCategories } from '@/lib/data/partners';
import { invalidateLogoCache } from '@/lib/logo-overrides';
import { Loader2, Pencil, RotateCcw, Upload } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LogoRow {
  id: string;
  logo_url: string;
  logo_variant: 'color' | 'mono-light';
}

// ─── Flat list of all partners ────────────────────────────────────────────────

interface PartnerEntry {
  name: string;
  categoryTitle: string;
  staticLogo?: string;
  staticVariant?: 'color' | 'mono-light';
  url?: string;
}

const allPartners: PartnerEntry[] = partnerCategories.flatMap(cat =>
  cat.partners.map(p => ({
    name: p.name,
    categoryTitle: cat.title,
    staticLogo: p.logo,
    staticVariant: p.logoVariant,
    url: p.url,
  }))
);

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminLogosPage() {
  const [overrides, setOverrides] = useState<Map<string, LogoRow>>(new Map());
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState<PartnerEntry | null>(null);
  const [setupSql, setSetupSql]   = useState<string | null>(null);
  const [retrying, setRetrying]   = useState(false);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('partner_logos').select('*');
    if (error && error.code === '42P01') {
      const res = await fetch('/api/setup-partner-logos', { method: 'POST' });
      const json = await res.json();
      if (!json.ok) setSetupSql(json.sql ?? null);
      setLoading(false);
      return;
    }
    const map = new Map<string, LogoRow>();
    for (const row of (data ?? []) as LogoRow[]) map.set(row.id, row);
    setOverrides(map);
    setSetupSql(null);
    setLoading(false);
  }

  async function retry() {
    setRetrying(true);
    await load();
    setRetrying(false);
  }

  useEffect(() => { load(); }, []);

  async function handleReset(name: string) {
    if (!confirm(`Сбросить логотип «${name}» к исходному?`)) return;
    const supabase = createClient();
    await supabase.from('partner_logos').delete().eq('id', name);
    invalidateLogoCache();
    load();
  }

  // Group by category for display
  const byCategory = partnerCategories.map(cat => ({
    ...cat,
    entries: allPartners.filter(p => p.categoryTitle === cat.title),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-white">Логотипы партнёров</h1>
        <p className="text-sm text-gray-500">{allPartners.length} компаний</p>
      </div>

      <p className="text-sm text-gray-400">
        Загрузите логотип для любой компании. Он заменит статичный файл на всех страницах сайта.
        Поддерживаются PNG, JPG, SVG, WebP.
      </p>

      {/* Setup required */}
      {setupSql && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-3">
          <p className="font-semibold text-amber-300">⚠ Таблица partner_logos не найдена</p>
          <p className="text-sm text-amber-200/80">
            Выполните этот SQL в <strong>Supabase Dashboard → SQL Editor</strong>, затем нажмите «Готово».
          </p>
          <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 text-xs text-green-300 leading-relaxed">
            {setupSql}
          </pre>
          <button onClick={retry} disabled={retrying}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-50">
            {retrying ? <><Loader2 className="mr-1.5 inline h-4 w-4 animate-spin" />Проверяем…</> : 'Готово — проверить'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Загрузка…
        </div>
      ) : setupSql ? null : (
        <div className="space-y-8">
          {byCategory.map(cat => (
            <section key={cat.id}>
              <h2 className="mb-3 font-display text-lg font-bold text-white border-b border-white/10 pb-2">
                {cat.title}
                <span className="ml-2 text-sm font-normal text-gray-500">{cat.entries.length}</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cat.entries.map(partner => {
                  const ov = overrides.get(partner.name);
                  const activeLogo   = ov?.logo_url   ?? partner.staticLogo ?? '';
                  const activeVariant = ov?.logo_variant ?? partner.staticVariant ?? 'color';
                  const hasOverride   = Boolean(ov);

                  return (
                    <div key={partner.name}
                      className="card-premium flex flex-col gap-3 p-4 relative">

                      {/* Override badge */}
                      {hasOverride && (
                        <span className="absolute right-3 top-3 rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                          изменён
                        </span>
                      )}

                      {/* Logo preview */}
                      <div className="flex h-16 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-3">
                        {activeLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={activeLogo}
                            alt={partner.name}
                            className={
                              'max-h-12 w-auto max-w-full object-contain ' +
                              (activeVariant === 'mono-light' ? 'brightness-0 invert' : '')
                            }
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <span className="font-display text-sm font-bold uppercase tracking-wider text-gray-400">
                            {partner.name}
                          </span>
                        )}
                      </div>

                      {/* Partner info */}
                      <div>
                        <div className="font-semibold text-white text-sm">{partner.name}</div>
                        {activeLogo && (
                          <div className="mt-0.5 truncate text-[11px] text-gray-500" title={activeLogo}>
                            {activeLogo}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => setEditing(partner)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 py-1.5 text-xs text-gray-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          {activeLogo ? 'Заменить' : 'Загрузить'}
                        </button>
                        {hasOverride && (
                          <button
                            onClick={() => handleReset(partner.name)}
                            title="Сбросить к исходному"
                            className="rounded-lg border border-white/10 px-2 py-1.5 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {editing && (
        <LogoEditModal
          partner={editing}
          current={overrides.get(editing.name)}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); invalidateLogoCache(); load(); }}
        />
      )}
    </div>
  );
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

function LogoEditModal({ partner, current, onClose, onSaved }: {
  partner: PartnerEntry;
  current: LogoRow | undefined;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [url,      setUrl]      = useState(current?.logo_url   ?? partner.staticLogo ?? '');
  const [variant,  setVariant]  = useState<'color'|'mono-light'>(current?.logo_variant ?? partner.staticVariant ?? 'color');
  const [uploading, setUploading] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState<string | null>(null);
  const [imgOk,    setImgOk]    = useState(true);

  async function uploadFile(file: File) {
    setUploading(true); setErr(null);
    try {
      const supabase = createClient();
      const ext  = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
      const safe = partner.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const path = `${safe}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('partner-logos').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('partner-logos').getPublicUrl(path);
      setUrl(data.publicUrl);
      setImgOk(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!url.trim()) { setErr('Введите URL или загрузите файл'); return; }
    setSaving(true); setErr(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('partner_logos').upsert(
        { id: partner.name, logo_url: url.trim(), logo_variant: variant },
        { onConflict: 'id' }
      );
      if (error) throw error;
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1827] p-6 space-y-5"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-white">{partner.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
        </div>

        {/* Preview */}
        <div className="flex h-24 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
          {url && imgOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="preview"
              className={'max-h-16 w-auto max-w-full object-contain ' + (variant === 'mono-light' ? 'brightness-0 invert' : '')}
              onError={() => setImgOk(false)} onLoad={() => setImgOk(true)} />
          ) : (
            <span className="text-sm text-gray-500">Нет превью</span>
          )}
        </div>

        {/* Upload */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Загрузить файл</label>
          <label className={`flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-3 text-sm text-gray-400 transition hover:border-blue-500/50 hover:text-white ${uploading ? 'opacity-50' : ''}`}>
            <Upload className="h-4 w-4" />
            {uploading ? 'Загрузка…' : 'Выбрать PNG / SVG / JPG / WebP'}
            <input type="file" accept="image/*" className="hidden"
              disabled={uploading}
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
          </label>
        </div>

        {/* URL */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Или вставьте URL логотипа</label>
          <input value={url} onChange={e => { setUrl(e.target.value); setImgOk(true); }}
            placeholder="https://example.com/logo.svg"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50" />
        </div>

        {/* Variant */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Цветовой вариант</label>
          <div className="flex gap-2">
            {(['color', 'mono-light'] as const).map(v => (
              <button key={v} type="button" onClick={() => setVariant(v)}
                className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition ${variant === v ? 'border-blue-500 bg-blue-500/20 text-blue-300' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>
                {v === 'color' ? '🎨 Цветной' : '⬜ Инвертировать (белый на тёмном)'}
              </button>
            ))}
          </div>
        </div>

        {err && <p className="text-sm text-red-400">{err}</p>}

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 py-2 text-sm text-gray-400 transition hover:bg-white/5">
            Отмена
          </button>
          <button onClick={save} disabled={saving || uploading}
            className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50">
            {saving ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}
