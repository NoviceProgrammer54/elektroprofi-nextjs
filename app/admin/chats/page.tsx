'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, Send } from 'lucide-react';

interface Session {
  id: string; guest_name: string; status: string;
  last_message_at: string; created_at: string;
}
interface Msg {
  id: string; session_id: string; sender: 'guest' | 'admin';
  body: string; created_at: string;
}

function isActive(s: string) { return s === 'active' || s === 'open'; }

export default function AdminChatsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [confirmClose, setConfirmClose] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-close stale sessions (no message for 30+ min)
  useEffect(() => {
    async function autoClose() {
      const supabase = createClient();
      const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      await supabase.from('chat_sessions')
        .update({ status: 'closed' })
        .in('status', ['active', 'open', 'waiting'])
        .lt('last_message_at', cutoff);
    }
    autoClose();
    const id = setInterval(autoClose, 30_000);
    return () => clearInterval(id);
  }, []);

  // Load sessions + realtime
  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data } = await supabase.from('chat_sessions').select('*')
        .order('created_at', { ascending: true }).limit(200);
      setSessions((data as Session[]) ?? []);
    }
    load();
    const ch = supabase.channel('admin-sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Load messages + realtime for active session
  useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    const supabase = createClient();
    async function load() {
      const { data } = await supabase.from('chat_messages').select('*')
        .eq('session_id', activeId).order('created_at', { ascending: true });
      setMessages((data as Msg[]) ?? []);
    }
    load();
    const ch = supabase.channel(`admin-msgs-${activeId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${activeId}` },
        payload => setMessages(prev => [...prev, payload.new as Msg]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const { activeList, waiting, closed } = useMemo(() => {
    const a: Session[] = [], w: Session[] = [], c: Session[] = [];
    for (const s of sessions) {
      if (isActive(s.status)) a.push(s);
      else if (s.status === 'waiting') w.push(s);
      else c.push(s);
    }
    a.sort((x,y) => y.last_message_at.localeCompare(x.last_message_at));
    w.sort((x,y) => x.created_at.localeCompare(y.created_at));
    c.sort((x,y) => y.last_message_at.localeCompare(x.last_message_at));
    return { activeList: a, waiting: w, closed: c };
  }, [sessions]);

  useEffect(() => {
    if (!activeId && activeList[0]) setActiveId(activeList[0].id);
  }, [activeId, activeList]);

  const currentSession = sessions.find(s => s.id === activeId);
  const canReply = currentSession ? isActive(currentSession.status) : false;

  async function openSession(id: string) {
    setActiveId(id);
    try {
      const supabase = createClient();
      await supabase.from('telegram_bot_state').update({ active_session_id: id }).eq('id', 1);
    } catch {}
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeId || !canReply) return;
    const body = input.trim(); setInput('');
    const supabase = createClient();
    const { error } = await supabase.from('chat_messages').insert({ session_id: activeId, sender: 'admin', body });
    if (error) { setInput(body); return; }
    await supabase.from('chat_sessions').update({ last_message_at: new Date().toISOString() }).eq('id', activeId);
  }

  async function handleCloseAndNext() {
    if (!activeId) return;
    if (!confirmClose) { setConfirmClose(true); setTimeout(() => setConfirmClose(false), 4000); return; }
    setConfirmClose(false);
    const supabase = createClient();
    await supabase.from('chat_sessions').update({ status: 'closed' }).eq('id', activeId);
    // Open next waiting session if exists
    const next = waiting[0];
    if (next) {
      await supabase.from('chat_sessions').update({ status: 'active' }).eq('id', next.id);
      setActiveId(next.id);
    } else {
      setActiveId(null);
    }
  }

  function renderItem(s: Session, badge?: React.ReactNode) {
    return (
      <li key={s.id}>
        <button onClick={() => openSession(s.id)}
          className={`w-full border-b border-white/5 p-3 text-left text-sm transition hover:bg-white/[0.03] ${activeId===s.id ? 'bg-white/[0.05]' : ''}`}>
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-medium text-white">{s.guest_name}</span>
            {badge}
          </div>
          <div className="mt-1 text-xs text-gray-500">{new Date(s.last_message_at).toLocaleString('ru-RU')}</div>
        </button>
      </li>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-4">Чаты</h1>
      <div className="grid grid-cols-[300px_1fr] gap-4" style={{height:'calc(100vh - 200px)'}}>
        {/* Sidebar */}
        <aside className="overflow-y-auto rounded-xl border border-white/10 bg-[#0a1220]">
          <Group title={`Активные${activeList.length?` (${activeList.length})`:' (нет)'}`}>
            {activeList.length === 0 && <p className="p-4 text-sm text-gray-500">Нет активных диалогов</p>}
            <ul>{activeList.map(s => renderItem(s, <span className="text-[10px] text-blue-400">в работе</span>))}</ul>
          </Group>
          <Group title={`Очередь (${waiting.length})`}>
            {waiting.length === 0 && <p className="p-4 text-sm text-gray-500">Очередь пуста</p>}
            <ul>{waiting.map((s,i) => renderItem(s, <span className="text-[10px] text-gray-500">#{i+1}</span>))}</ul>
          </Group>
          <Group title={`Закрытые (${closed.length})`}>
            <ul>{closed.slice(0,30).map(s => renderItem(s, <span className="text-[10px] text-gray-600">закрыт</span>))}</ul>
          </Group>
        </aside>

        {/* Chat area */}
        <section className="flex flex-col rounded-xl border border-white/10 bg-[#0a1220]">
          {!activeId || !currentSession ? (
            <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">Выберите диалог слева</div>
          ) : (
            <>
              <header className="flex items-center justify-between gap-3 border-b border-white/5 p-3">
                <div>
                  <div className="font-semibold text-white">{currentSession.guest_name}</div>
                  <div className="text-xs text-gray-500">
                    {currentSession.status === 'waiting' && 'В очереди'}
                    {isActive(currentSession.status) && 'Активный диалог'}
                    {currentSession.status === 'closed' && 'Чат завершён'}
                  </div>
                </div>
                {isActive(currentSession.status) && (
                  <button onClick={handleCloseAndNext}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${confirmClose ? 'bg-red-500 text-white' : 'border border-white/10 text-gray-400 hover:bg-white/5'}`}>
                    <CheckCircle2 className="h-4 w-4" />
                    {confirmClose ? 'Подтвердить закрытие' : 'Завершить и следующий'}
                  </button>
                )}
              </header>

              <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender==='admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${m.sender==='admin' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-200'}`}>
                      <div className="whitespace-pre-wrap break-words">{m.body}</div>
                      <div className="mt-1 text-[10px] opacity-60">{new Date(m.created_at).toLocaleTimeString('ru-RU')}</div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex gap-2 border-t border-white/5 p-3">
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); handleSend(e as unknown as React.FormEvent); } }}
                  rows={1} placeholder={canReply ? 'Ответ посетителю…' : 'Чат недоступен'} disabled={!canReply} maxLength={2000}
                  className="flex-1 resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none disabled:opacity-50 min-h-[40px]" />
                <button type="submit" disabled={!input.trim()||!canReply}
                  className="rounded-lg bg-blue-500 px-3 py-2 text-white transition hover:bg-blue-600 disabled:opacity-50">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/5 last:border-0">
      <div className="border-b border-white/5 bg-white/[0.02] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">{title}</div>
      {children}
    </div>
  );
}
