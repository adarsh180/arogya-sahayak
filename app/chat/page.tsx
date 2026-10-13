'use client'

import { ChangeEvent, FormEvent, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  AlertTriangle, ArrowUp, BookOpen, Check, Copy, FileText, GraduationCap, HeartPulse, History,
  MessageSquarePlus, Paperclip, ShieldCheck, Siren, Trash2, UserRound, Volume2, X
} from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import MessageRenderer from '@/components/MessageRenderer'
import VoiceComposer, { speakText } from '@/components/voice/VoiceComposer'
import { Segmented, Spinner, cx } from '@/components/ui/kit'
import { api, errorMessage } from '@/lib/client-api'

type Message = { id: string; role: 'user' | 'assistant'; content: string; createdAt?: string }
type ChatSession = { id: string; title: string; type?: string; language?: string; updatedAt: string; messages?: Message[] }
type Source = { id: string; title: string; publisher: string; url: string; reviewedAt: string }
type Upload = { fileName: string; text: string; privacyNotice?: string }
type Mode = 'medical' | 'student'
type ChatResult = { message: Message; chatSessionId: string; sources?: Source[] }

const languages = [
  ['en', 'English'], ['hi', 'हिंदी'], ['bn', 'বাংলা'], ['te', 'తెలుగు'], ['mr', 'मराठी'], ['ta', 'தமிழ்'],
  ['gu', 'ગુજરાતી'], ['kn', 'ಕನ್ನಡ'], ['ml', 'മലയാളം'], ['pa', 'ਪੰਜਾਬੀ'], ['or', 'ଓଡ଼ିଆ'], ['ur', 'اردو']
]

const prompts: Record<Mode, string[]> = {
  medical: [
    'Help me prepare questions for a doctor visit',
    'Explain my blood pressure reading in simple terms',
    'What should I track when a new symptom starts?',
    'How do I take medicines safely with food?',
  ],
  student: [
    'Teach cardiac output through a clinical case',
    'Quiz me on autonomic pharmacology',
    'Build a 25-minute active-recall session on renal physiology',
    'Compare nephritic and nephrotic syndrome',
  ],
}

const presets: Record<string, string> = {
  appointment: 'Help me prepare for an upcoming doctor appointment: what details and questions should I bring?',
}

export default function ChatPage() {
  return <AppShell flush loadingLabel="Opening your conversation"><Suspense fallback={null}><Chat /></Suspense></AppShell>
}

function Chat() {
  const router = useRouter()
  const params = useSearchParams()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [chatId, setChatId] = useState<string>()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState('en')
  const [sources, setSources] = useState<Record<string, Source[]>>({})
  const [upload, setUpload] = useState<Upload>()
  const [busy, setBusy] = useState(false)
  const [opening, setOpening] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [mode, setMode] = useState<Mode>(params.get('type') === 'student' ? 'student' : 'medical')
  const [copiedId, setCopiedId] = useState<string>()
  const scroller = useRef<HTMLDivElement>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)

  const loadSessions = useCallback(() => api<ChatSession[]>('/api/chat').then(setSessions).catch(() => undefined), [])

  useEffect(() => {
    loadSessions()
    const preset = params.get('prompt')
    if (preset) setInput(presets[preset] || preset.slice(0, 500))
  }, [loadSessions, params])

  useEffect(() => {
    const element = scroller.current
    if (!element || (!messages.length && !busy)) return
    const frame = requestAnimationFrame(() => element.scrollTo({ top: element.scrollHeight, behavior: messages.length > 2 ? 'smooth' : 'auto' }))
    return () => cancelAnimationFrame(frame)
  }, [messages.length, busy])

  // Grow the composer with its content, up to a limit.
  useLayoutEffect(() => {
    const element = textarea.current
    if (!element) return
    element.style.height = '0px'
    element.style.height = `${Math.min(element.scrollHeight, 180)}px`
  }, [input])

  async function openChat(id: string) {
    setOpening(true)
    setHistoryOpen(false)
    try {
      const chat = await api<ChatSession>(`/api/chat/${id}`)
      setChatId(chat.id)
      setMessages(chat.messages || [])
      setSources({})
      if (chat.type) setMode(chat.type === 'student' || chat.type === 'study' ? 'student' : 'medical')
      if (chat.language) setLanguage(chat.language)
    } catch (reason) {
      toast.error(errorMessage(reason, 'This conversation could not be opened.'))
    } finally {
      setOpening(false)
    }
  }

  async function removeChat(id: string) {
    if (!window.confirm('Delete this conversation? This cannot be undone.')) return
    try {
      await api(`/api/chat/${id}`, { method: 'DELETE' })
      setSessions(items => items.filter(item => item.id !== id))
      if (chatId === id) startNew()
      toast.success('Conversation deleted')
    } catch (reason) {
      toast.error(errorMessage(reason))
    }
  }

  function startNew() {
    setChatId(undefined)
    setMessages([])
    setSources({})
    setUpload(undefined)
    setHistoryOpen(false)
    textarea.current?.focus()
  }

  function changeMode(next: Mode) {
    if (next === mode) return
    startNew()
    setMode(next)
    router.replace(next === 'student' ? '/chat?type=student' : '/chat', { scroll: false })
  }

  async function copyMessage(message: Message) {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopiedId(message.id)
      window.setTimeout(() => setCopiedId(undefined), 1_500)
    } catch {
      toast.error('Copy is not available in this browser.')
    }
  }

  const appendTranscript = useCallback((text: string) => setInput(current => (current ? `${current} ${text}` : text)), [])

  async function attachFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('Please choose a file smaller than 5 MB.')
    const data = new FormData()
    data.append('file', file)
    const toastId = toast.loading('Reading the document…')
    try {
      const result = await api<Upload>('/api/upload', { method: 'POST', body: data })
      setUpload(result)
      toast.success('Document attached. Remove identifiers you do not need before sending.', { id: toastId })
    } catch (reason) {
      toast.error(errorMessage(reason, 'This document could not be read.'), { id: toastId })
    }
  }

  async function send(event?: FormEvent, preset?: string) {
    event?.preventDefault()
    const content = (preset || input).trim()
    if (!content || busy) return
    const optimistic: Message = { id: `local-${Date.now()}`, role: 'user', content }
    setMessages(items => [...items, optimistic])
    setInput('')
    setBusy(true)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 55_000)
    try {
      const result = await api<ChatResult>('/api/chat', {
        method: 'POST',
        signal: controller.signal,
        json: { message: content, chatSessionId: chatId, type: mode, language, fileContent: upload },
      })
      setChatId(result.chatSessionId)
      setMessages(items => [...items, { ...result.message, role: 'assistant' }])
      if (result.sources?.length) setSources(items => ({ ...items, [result.message.id]: result.sources! }))
      setUpload(undefined)
      loadSessions()
    } catch (reason) {
      setMessages(items => items.filter(item => item.id !== optimistic.id))
      setInput(content)
      toast.error(reason instanceof DOMException && reason.name === 'AbortError' ? 'The answer took too long. Please try again.' : errorMessage(reason, 'Unable to send this message.'))
    } finally {
      window.clearTimeout(timeout)
      setBusy(false)
    }
  }

  return (
    <div className={cx('chat', historyOpen && 'is-history-open')}>
      <aside className="chat-history" aria-label="Conversation history">
        <div className="chat-history-head">
          <strong>Conversations</strong>
          <button type="button" className="ui-icon-btn chat-history-close" onClick={() => setHistoryOpen(false)} aria-label="Close history"><X /></button>
        </div>
        <button type="button" className="ui-btn ui-btn-block" onClick={startNew}><MessageSquarePlus /> New conversation</button>
        <div className="chat-history-list">
          {sessions.length ? sessions.map(session => (
            <div key={session.id} className={cx('chat-history-item', chatId === session.id && 'is-active')}>
              <button type="button" onClick={() => openChat(session.id)}>
                {session.type === 'student' || session.type === 'study' ? <GraduationCap /> : <HeartPulse />}
                <span><strong>{session.title}</strong><small>{new Date(session.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</small></span>
              </button>
              <button type="button" className="ui-icon-btn is-danger" onClick={() => removeChat(session.id)} aria-label={`Delete ${session.title}`}><Trash2 /></button>
            </div>
          )) : <p className="chat-history-empty">Your saved conversations will appear here.</p>}
        </div>
        <p className="chat-history-note"><ShieldCheck /> Saved to your account. Share only what the question needs.</p>
      </aside>
      <button type="button" className="chat-scrim" onClick={() => setHistoryOpen(false)} aria-label="Close history" tabIndex={historyOpen ? 0 : -1} />

      <section className="chat-main">
        <header className="chat-bar">
          <button type="button" className="ui-icon-btn is-outlined chat-history-toggle" onClick={() => setHistoryOpen(true)} aria-label="Show conversation history"><History /></button>
          <Segmented<Mode> label="Conversation mode" value={mode} onChange={changeMode} options={[{ value: 'medical', label: 'Health', icon: HeartPulse }, { value: 'student', label: 'Study', icon: GraduationCap }]} />
          <label className="chat-language"><span className="sr-only">Response language</span>
            <select className="ui-select" value={language} onChange={event => setLanguage(event.target.value)}>{languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select>
          </label>
        </header>

        {mode === 'medical'
          ? <div className="chat-strip is-danger"><Siren /><span><strong>Possible emergency?</strong> Call 112 or go to the nearest emergency department — don’t wait for a reply here.</span></div>
          : <div className="chat-strip"><BookOpen /><span>Generated teaching material — check it against your curriculum and primary sources.</span></div>}

        <div className="chat-scroll" ref={scroller}>
          {opening ? <div className="chat-opening"><Spinner /> Opening conversation…</div> : !messages.length ? (
            <div className="chat-welcome">
              <div className="chat-welcome-mark"><Image src="/arogya-mark.png" alt="" width={44} height={44} priority /></div>
              <span className="ui-kicker is-plain">{mode === 'student' ? 'Learn by reasoning' : 'Clear context before conclusions'}</span>
              <h1>{mode === 'student' ? 'What shall we work through today?' : 'What can I help you understand?'}</h1>
              <p>{mode === 'student'
                ? 'I’ll set an objective, test what you recall, walk through a case and help you close the gaps.'
                : 'I’ll ask for the context that matters, use reviewed sources where available and keep the next step clear. I can’t diagnose or replace a clinician.'}</p>
              <div className="chat-prompts">
                {prompts[mode].map(prompt => <button key={prompt} type="button" onClick={() => send(undefined, prompt)}>{prompt}<ArrowUp /></button>)}
              </div>
            </div>
          ) : (
            <div className="chat-thread">
              {messages.map(message => (
                <article key={message.id} className={cx('chat-msg', `is-${message.role}`)}>
                  <div className="chat-avatar" aria-hidden="true">{message.role === 'assistant' ? <Image src="/arogya-mark.png" alt="" width={20} height={20} /> : <UserRound />}</div>
                  <div className="chat-bubble">
                    <MessageRenderer content={message.content} />
                    {sources[message.id]?.length ? (
                      <div className="chat-sources">
                        <span><BookOpen /> Sources consulted</span>
                        {sources[message.id].map(source => <Link key={source.id} href={`/resources/${encodeURIComponent(source.id)}`}><strong>{source.title}</strong><small>{source.publisher}</small></Link>)}
                      </div>
                    ) : null}
                    <div className="chat-msg-actions">
                      <button type="button" onClick={() => copyMessage(message)} aria-label="Copy message">{copiedId === message.id ? <Check /> : <Copy />}</button>
                      {message.role === 'assistant' && <button type="button" onClick={() => speakText(message.content, language) || toast.error('Read-aloud is not supported in this browser.')} aria-label="Read aloud"><Volume2 /></button>}
                    </div>
                  </div>
                </article>
              ))}
              {busy && (
                <article className="chat-msg is-assistant">
                  <div className="chat-avatar" aria-hidden="true"><Image src="/arogya-mark.png" alt="" width={20} height={20} /></div>
                  <div className="chat-thinking" role="status"><i /><i /><i /><span>Reviewing context and evidence…</span></div>
                </article>
              )}
            </div>
          )}
        </div>

        <div className="chat-composer-wrap">
          {upload && <div className="chat-upload"><FileText /><span><strong>{upload.fileName}</strong>Will be included with your next message</span><button type="button" className="ui-icon-btn" onClick={() => setUpload(undefined)} aria-label="Remove attachment"><X /></button></div>}
          <form className="chat-composer" onSubmit={send}>
            <label className="ui-icon-btn chat-attach" title="Attach a PDF or text file">
              <Paperclip /><span className="sr-only">Attach a PDF or text file</span>
              <input type="file" accept="application/pdf,text/plain,.txt" onChange={attachFile} />
            </label>
            <textarea
              ref={textarea}
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send() } }}
              rows={1}
              maxLength={4000}
              placeholder={mode === 'student' ? 'Ask about a topic, or say “quiz me on…”' : 'Describe your question or what you want to prepare for…'}
              aria-label="Message"
            />
            <VoiceComposer language={language} disabled={busy} onTranscript={appendTranscript} />
            <button className="chat-send" type="submit" disabled={!input.trim() || busy} aria-label="Send message">{busy ? <Spinner /> : <ArrowUp />}</button>
          </form>
          <p className="chat-fineprint"><AlertTriangle /> Educational guidance only — not a diagnosis. Answers can be wrong; verify important decisions with a clinician.</p>
        </div>
      </section>
    </div>
  )
}
