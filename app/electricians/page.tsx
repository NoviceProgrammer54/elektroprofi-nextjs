'use client';
import Link from 'next/link';
import {
  Briefcase, Download, ExternalLink, FileText, GraduationCap,
  MapPin, MessageCircle, ShieldCheck, Sparkles, Star,
  User, Wallet, Wrench,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cities } from '@/lib/data/cities';
import { type Expert, experts as staticExperts, fullName } from '@/lib/data/experts';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { PolicyDialog } from '@/components/PolicyDialog';
import { ReviewsSection } from '@/components/ReviewsSection';
import { responsibilityPolicy } from '@/lib/data/policies';
import { SmartImage } from '@/components/SmartImage';
import { useLang, useT, useTT } from '@/lib/i18n/useT';
import { cn } from '@/lib/utils';

// -----------------------------------------------------------------------------
// useDbExperts
// -----------------------------------------------------------------------------
type DbExpertRow = {
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
  skills: string[] | null;
  preferred_work_main: string[] | null;
  preferred_work_extra: string[] | null;
  payment_methods: string[] | null;
  instagram: string | null;
  interests: string | null;
  hobbies: string | null;
  short_bio: string | null;
  photo_url: string | null;
  permit_document_url: string | null;
  education_document_url: string | null;
};

function dbRowToExpert(r: DbExpertRow): Expert {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    cityId: r.city_id,
    status: r.status as Expert['status'],
    role: (r.role ?? undefined) as Expert['role'],
    skillLevel: (r.skill_level ?? undefined) as Expert['skillLevel'],
    specialization: r.specialization,
    description: r.description,
    experienceYears: r.experience_years ?? undefined,
    experience: r.experience ?? undefined,
    education: r.education ?? undefined,
    permitGroup: r.permit_group ?? undefined,
    skills: r.skills ?? undefined,
    preferredWorkMain: r.preferred_work_main ?? undefined,
    preferredWorkExtra: r.preferred_work_extra ?? undefined,
    paymentMethods: r.payment_methods ?? undefined,
    instagram: r.instagram ?? undefined,
    interests: r.interests ?? undefined,
    hobbies: r.hobbies ?? undefined,
    shortBio: r.short_bio ?? undefined,
    photoUrl: r.photo_url,
    permitDocumentUrl: r.permit_document_url,
    educationDocumentUrl: r.education_document_url,
  };
}

function useDbExperts(): Expert[] {
  const [rows, setRows] = useState<Expert[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .limit(500);
      if (cancelled) return;
      if (!error && data) setRows((data as DbExpertRow[]).map(dbRowToExpert));
    })();
    return () => { cancelled = true; };
  }, []);
  return rows;
}

// -----------------------------------------------------------------------------
// SkillLevelBadge
// -----------------------------------------------------------------------------
const SKILL_STARS: Record<string, number> = {
  'Стажёр': 1, 'Монтажник': 2, 'Мастер': 3, 'Master': 3,
  'Профи': 4, 'Profi': 4, 'Эксперт': 5, 'Expert': 5,
};

function SkillLevelBadge({ level, small }: { level: string; small?: boolean }) {
  const lang = useLang();
  const count = SKILL_STARS[level] ?? 0;
  const ariaLabel = count > 0
    ? lang === 'kz' ? `${level}, ${count} / 5 жұлдыз` : `${level}, ${count} из 5`
    : level;
  if (!count) {
    return (
      <Badge variant="secondary" aria-label={ariaLabel}
        className={small ? 'text-[10px] uppercase tracking-wider' : 'text-xs'}>
        {level}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" aria-label={ariaLabel}
      className={small ? 'text-[10px] uppercase tracking-wider' : 'text-xs'}>
      <span className="inline-flex items-center gap-1">
        {level}
        <span className="inline-flex" aria-hidden="true">
          {Array.from({ length: count }).map((_, i) => (
            <Star key={i} className="h-2.5 w-2.5 fill-amber-300 text-amber-300 drop-shadow-[0_0_2px_rgba(251,191,36,0.6)]" />
          ))}
        </span>
      </span>
    </Badge>
  );
}

// -----------------------------------------------------------------------------
// Section helper (inside dialog)
// -----------------------------------------------------------------------------
function Section({ icon, title, children }: {
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h4 className="font-display text-base">{title}</h4>
      </div>
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// ExpertDialog
// -----------------------------------------------------------------------------
function ExpertDialog({
  expert, cityName, onOpenChange,
}: {
  expert: Expert | null;
  cityName: string;
  onOpenChange: (open: boolean) => void;
}) {
  const tt = useTT();
  const lang = useLang();
  const [docOpen, setDocOpen] = useState(false);
  const [eduDocOpen, setEduDocOpen] = useState(false);

  return (
    <Dialog open={!!expert} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {expert && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                {expert.photoUrl ? (
                  <SmartImage
                    src={expert.photoUrl}
                    alt={fullName(expert)}
                    width={80} height={80}
                    priority
                    className="h-20 w-20 shrink-0 rounded-2xl"
                    imgClassName="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div
                    className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-primary-foreground"
                    style={{ background: 'var(--gradient-accent)' }}
                    aria-hidden
                  >
                    <User className="h-8 w-8" />
                  </div>
                )}
                <div className="min-w-0 flex-1 text-left">
                  <DialogTitle className="font-display text-2xl">{fullName(expert)}</DialogTitle>
                  <DialogDescription className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      <ShieldCheck className="h-3 w-3" />
                      {tt(expert.status)}
                    </span>
                    {expert.role && (
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                        {tt(expert.role)}
                      </Badge>
                    )}
                    {expert.skillLevel && <SkillLevelBadge level={tt(expert.skillLevel)} small />}
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {tt(cityName)}
                    </span>
                    {expert.experience && (
                      <span className="text-muted-foreground">· {tt(expert.experience)}</span>
                    )}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-4 grid gap-4">
              {(expert.permitGroup || expert.permitDocumentUrl) && (
                <Section icon={<ShieldCheck className="h-4 w-4 text-primary" />} title={tt('Группа допуска')}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">
                      {expert.permitGroup ? tt(expert.permitGroup) : tt('Нет')}
                    </div>
                    {expert.permitDocumentUrl && (
                      <Button type="button" variant="outline" size="sm"
                        onClick={() => setDocOpen(true)} className="gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        {tt('Просмотреть документ')}
                      </Button>
                    )}
                  </div>
                </Section>
              )}

              {(expert.education || expert.educationDocumentUrl) && (
                <Section icon={<GraduationCap className="h-4 w-4 text-primary" />} title={tt('Образование')}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">
                      {expert.education ? tt(expert.education) : tt('Нет')}
                    </div>
                    {expert.educationDocumentUrl && (
                      <Button type="button" variant="outline" size="sm"
                        onClick={() => setEduDocOpen(true)} className="gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        {tt('Просмотреть документ')}
                      </Button>
                    )}
                  </div>
                </Section>
              )}

              {expert.skills && expert.skills.length > 0 && (
                <Section icon={<Wrench className="h-4 w-4 text-primary" />} title={tt('Навыки в электрике')}>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {expert.skills.map((s) => (
                      <li key={s} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                        <span>{tt(s)}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {(expert.preferredWorkMain?.length || expert.preferredWorkExtra?.length) && (
                <Section icon={<Briefcase className="h-4 w-4 text-primary" />} title={tt('Предпочитаемые виды работ')}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {expert.preferredWorkMain && expert.preferredWorkMain.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {tt('Основные')}
                        </div>
                        <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                          {expert.preferredWorkMain.map((w) => (
                            <li key={w} className="flex gap-2">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                              <span>{tt(w)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {expert.preferredWorkExtra && expert.preferredWorkExtra.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {tt('Дополнительные')}
                        </div>
                        <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                          {expert.preferredWorkExtra.map((w) => (
                            <li key={w} className="flex gap-2">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                              <span>{tt(w)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {expert.paymentMethods && expert.paymentMethods.length > 0 && (
                <Section icon={<Wallet className="h-4 w-4 text-primary" />} title={tt('Способы оплаты')}>
                  <ul className="flex flex-wrap gap-2">
                    {expert.paymentMethods.map((p) => (
                      <li key={p}>
                        <Badge variant="secondary" className="text-xs">{tt(p)}</Badge>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {(expert.instagram || expert.interests || expert.hobbies) && (
                <Section icon={<Sparkles className="h-4 w-4 text-primary" />} title={tt('Дополнительная информация')}>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {expert.instagram && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-primary" />
                        <a
                          href={`https://instagram.com/${expert.instagram.replace(/^@/, '')}`}
                          target="_blank" rel="noreferrer"
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {expert.instagram}
                        </a>
                      </div>
                    )}
                    {expert.interests && (
                      <p>
                        <span className="font-medium text-foreground">{tt('Профессиональные интересы:')} </span>
                        {tt(expert.interests)}
                      </p>
                    )}
                    {expert.hobbies && (
                      <p>
                        <span className="font-medium text-foreground">{tt('Хобби:')} </span>
                        {tt(expert.hobbies)}
                      </p>
                    )}
                  </div>
                </Section>
              )}

              {expert.shortBio && (
                <Section icon={<User className="h-4 w-4 text-primary" />} title={tt('О себе')}>
                  <p className="text-sm text-muted-foreground">{tt(expert.shortBio)}</p>
                </Section>
              )}

              <div className="flex justify-end pt-2">
                <Link href={lang === 'kz' ? '/contacts?lang=kz' : '/contacts'}
                  className={cn(buttonVariants({ variant: 'outline' }), 'gap-1.5')}>
                  <MessageCircle className="h-4 w-4" />
                  {tt('Связаться')}
                </Link>
              </div>
            </div>
          </>
        )}
      </DialogContent>

      {/* Permit document viewer */}
      {expert?.permitDocumentUrl && (
        <Dialog open={docOpen} onOpenChange={setDocOpen}>
          <DialogContent className="flex h-[90vh] max-h-[90vh] flex-col p-0 sm:max-w-4xl">
            <DialogHeader className="flex-row items-center justify-between gap-2 border-b px-5 py-3">
              <div>
                <DialogTitle className="font-display text-lg">{tt('Документ о группе допуска')}</DialogTitle>
                <DialogDescription className="text-xs">{expert && fullName(expert)}</DialogDescription>
              </div>
              <a href={expert.permitDocumentUrl} download target="_blank" rel="noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mr-8 gap-1.5')}>
                <Download className="h-3.5 w-3.5" />
                {tt('Скачать')}
              </a>
            </DialogHeader>
            <iframe src={expert.permitDocumentUrl} title={tt('Документ о группе допуска')}
              className="h-full w-full flex-1 bg-background" />
          </DialogContent>
        </Dialog>
      )}

      {/* Education document viewer */}
      {expert?.educationDocumentUrl && (
        <Dialog open={eduDocOpen} onOpenChange={setEduDocOpen}>
          <DialogContent className="flex h-[90vh] max-h-[90vh] flex-col p-0 sm:max-w-4xl">
            <DialogHeader className="flex-row items-center justify-between gap-2 border-b px-5 py-3">
              <div>
                <DialogTitle className="font-display text-lg">{tt('Документ об образовании')}</DialogTitle>
                <DialogDescription className="text-xs">{expert && fullName(expert)}</DialogDescription>
              </div>
              <a href={expert.educationDocumentUrl} download target="_blank" rel="noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mr-8 gap-1.5')}>
                <Download className="h-3.5 w-3.5" />
                {tt('Скачать')}
              </a>
            </DialogHeader>
            <iframe src={expert.educationDocumentUrl} title={tt('Документ об образовании')}
              className="h-full w-full flex-1 bg-background" />
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}

// -----------------------------------------------------------------------------
// Main page
// -----------------------------------------------------------------------------
export default function ElectriciansPage() {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get('city') ?? cities[0].id;
  const active = cities.find((c) => c.id === activeId) ?? cities[0];
  const dbExperts = useDbExperts();
  const allExperts = useMemo<Expert[]>(() => {
    const byId = new Map<string, Expert>();
    for (const e of staticExperts) byId.set(e.id, e);
    for (const e of dbExperts) byId.set(e.id, e);
    return Array.from(byId.values());
  }, [dbExperts]);
  const cityExperts = allExperts.filter((e) => e.cityId === activeId);
  const [openExpert, setOpenExpert] = useState<Expert | null>(null);
  const [openPolicy, setOpenPolicy] = useState(false);

  return (
    <div className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <span className="eyebrow"><MapPin className="h-3.5 w-3.5" /> {tt('10+ городов Казахстана')}</span>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <h1 className="page-title">{t('nav.electricians')}</h1>
            <Link href={`/join${langQuery}`}
              className={cn(buttonVariants(), 'btn-electric btn-electric-strong h-12 px-6 font-bold')}>
              {tt('Вступить в сообщество')}
            </Link>
          </div>
          <p className="page-lead">
            {tt('Резиденты и представители ELEKTROPROFI разделяют ценности качественного, безопасного и профессионального электромонтажа.')}
          </p>
        </div>
      </header>

      <PolicyDialog policy={responsibilityPolicy} open={openPolicy} onOpenChange={setOpenPolicy} />

      <section className="card-premium card-highlight flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-primary">{t('electricians.forClients.title')}</div>
          <p className="mt-2 text-sm text-muted-foreground">{t('electricians.forClients.text')}</p>
        </div>
        <Link href={`/hiring${langQuery}`}
          className={cn(buttonVariants(), 'btn-electric btn-electric-strong h-12 px-6 font-bold')}>
          {t('electricians.forClients.cta')}
        </Link>
      </section>

      <section aria-labelledby="roles-h" className="grid gap-5 md:grid-cols-2">
        <article className="card-premium card-highlight p-6">
          <h2 id="roles-h" className="font-display text-2xl text-primary">{tt('Представители ELEKTROPROFI')}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{t('electricians.reps.text')}</p>
        </article>
        <article className="card-premium card-highlight p-6">
          <h2 className="font-display text-2xl text-primary">{tt('Резиденты ELEKTROPROFI')}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{t('electricians.residents.text')}</p>
        </article>
      </section>

      <ReviewsSection
        id="reviews-electricians"
        roles={['electrician']}
        eyebrow={tt('Отзывы электриков')}
        title={tt('Что говорят электрики')}
        lead={tt('Мастера сообщества делятся опытом работы с ELEKTROPROFI.')}
      />

      <section aria-labelledby="map-h" className="space-y-6">
        <div className="section-head">
          <h2 id="map-h" className="section-title">{t('electricians.mapTitle')}</h2>
          <p className="max-w-2xl text-muted-foreground">{t('electricians.mapSubtitle')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="card-premium flex flex-wrap gap-2 p-4">
            {cities.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => router.replace(
                  `/electricians?city=${c.id}${lang === 'kz' ? '&lang=kz' : ''}`,
                  { scroll: false },
                )}
                aria-pressed={c.id === activeId}
                className={cn(
                  'rounded-xl border px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  c.id === activeId
                    ? 'border-primary bg-primary/15 text-foreground'
                    : 'border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground',
                )}
              >
                {tt(c.name)}
              </button>
            ))}
          </div>
          <aside className="card-premium p-6">
            <h3 className="font-display text-2xl text-primary">{tt(active.name)}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{lang === 'kz' && active.textKz ? active.textKz : active.text}</p>
          </aside>
        </div>

        <div className="space-y-5">
          <div className="flex items-end justify-between">
            <h3 className="font-display text-2xl">
              {t('map.expertsTitle')} — {tt(active.name)}
            </h3>
            {cityExperts.length > 0 && (
              <span className="text-sm text-muted-foreground">{cityExperts.length}</span>
            )}
          </div>

          {cityExperts.length === 0 ? (
            <div className="card-premium p-8 text-center text-muted-foreground">
              {t('map.expertsEmpty')}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cityExperts.map((ex) => {
                const topSkills = (ex.skills ?? []).slice(0, 3);
                return (
                  <article
                    key={ex.id}
                    className="card-premium card-glow group flex flex-col overflow-hidden p-0"
                  >
                    {/* Full-width photo at top */}
                    <div className="relative aspect-[67/78] w-full overflow-hidden bg-surface">
                      {ex.photoUrl ? (
                        <SmartImage
                          src={ex.photoUrl}
                          alt={fullName(ex)}
                          aspectRatio="67 / 78"
                          className="block h-full w-full"
                          imgClassName="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div
                          className="grid h-full w-full place-items-center text-primary-foreground"
                          style={{ background: 'var(--gradient-accent)' }}
                          aria-hidden
                        >
                          <User className="h-16 w-16 opacity-80" />
                        </div>
                      )}
                      {/* Status badge overlaid on photo */}
                      <span
                        className="absolute left-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1 rounded-full border border-primary/40 bg-background/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur"
                        title={`${tt(ex.status)} ELEKTROPROFI`}
                      >
                        <ShieldCheck className="h-3 w-3 shrink-0" />
                        <span className="truncate">{tt(ex.status)}</span>
                      </span>
                    </div>

                    {/* Text block below photo */}
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div>
                        <h4 className="font-display text-lg leading-tight">{fullName(ex)}</h4>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {tt(active.name)}
                        </div>
                      </div>

                      <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                        {tt(ex.description)}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="text-xs">
                          <Briefcase className="mr-1 h-3 w-3" />
                          {tt(ex.specialization)}
                        </Badge>
                        {ex.role && (
                          <Badge variant="secondary" className="text-xs">{tt(ex.role)}</Badge>
                        )}
                        {ex.skillLevel && <SkillLevelBadge level={tt(ex.skillLevel)} />}
                      </div>

                      {topSkills.length > 0 && (
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {topSkills.map((s) => (
                            <li key={s} className="flex gap-2">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                              <span className="line-clamp-1">{s}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                        {ex.experienceYears !== undefined ? (
                          <div className="leading-tight">
                            <div className="font-display text-2xl text-primary">{ex.experienceYears}</div>
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              {t('map.experience')} · {t('map.years')}
                            </div>
                          </div>
                        ) : (
                          <span />
                        )}
                        <Button size="sm" variant="outline" onClick={() => setOpenExpert(ex)}>
                          {tt('Подробнее')}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <ExpertDialog
        expert={openExpert}
        cityName={openExpert ? (cities.find((c) => c.id === openExpert.cityId)?.name ?? '') : ''}
        onOpenChange={(o) => !o && setOpenExpert(null)}
      />
    </div>
  );
}
