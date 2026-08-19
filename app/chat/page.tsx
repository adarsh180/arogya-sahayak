'use client'

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  AlertTriangle, ArrowRight, BookOpen, Check, ChevronLeft, Copy, FileText,
  GraduationCap, HeartPulse, Menu, MessageSquarePlus, Paperclip, Send, ShieldCheck, Trash2, UserRound, Volume2, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import MessageRenderer from '@/components/MessageRenderer'
import VoiceComposer, { speakText } from '@/components/voice/VoiceComposer'

type Message = { id: string; role: 'user' | 'assistant'; content: string; createdAt?: string }
type ChatSession = { id: string; title: string; updatedAt: string; messages?: Message[] }
type Source = { id: string; title: string; publisher: string; url: string; reviewedAt: string }
type Upload = { fileName: string; text: string; privacyNotice?: string }
type ApiResult = { error?: string; code?: string; requestId?: string; [key: string]: unknown }

async function readApiResult(response: Response): Promise<ApiResult> {
  const body = await response.text()
  if (!body) return {}
  try {
    return JSON.parse(body) as ApiResult
  } catch {
    return { error: response.ok ? 'The server returned an invalid response.' : 'The deployed server could not process this request.' }
  }
}

const languages = [
  ['en', 'English'], ['hi', 'हिंदी'], ['bn', 'বাংলা'], ['te', 'తెలుగు'], ['mr', 'मराठी'], ['ta', 'தமிழ்'],
  ['gu', 'ગુજરાતી'], ['kn', 'ಕನ್ನಡ'], ['ml', 'മലയാളം'], ['pa', 'ਪੰਜਾਬੀ'], ['or', 'ଓଡ଼ିଆ'], ['ur', 'اردو']
]

const prompts = [
  'Help me prepare questions for a doctor visit',
  'Explain my blood pressure reading in simple terms',
  'What information should I track with a new symptom?'
]

export default function ChatPage() {
  const router = useRouter()
  const { status } = useSession()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [chatId, setChatId] = useState<string>()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState('en')
  const [sources, setSources] = useState<Record<string, Source[]>>({})
  const [upload, setUpload] = useState<Upload>()
  const [busy, setBusy] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [chatType, setChatType] = useState<'medical' | 'student'>('medical')
  const [copiedId, setCopiedId] = useState<string>()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin?callbackUrl=/chat')
    if (status === 'authenticated') loadSessions()
  }, [router, status])

  useEffect(() => {
    setChatType(new URLSearchParams(window.location.search).get('type') === 'student' ? 'student' : 'medical')
  }, [])

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, busy])

  async function loadSessions() {
    const response = await fetch('/api/chat')
    if (response.ok) setSessions(await response.json())
  }

  async function openChat(id: string) {
    const response = await fetch(`/api/chat/${id}`)
    if (!response.ok) return toast.error('This conversation could not be opened.')
    const chat = await response.json()
    setChatId(chat.id)
    setMessages(chat.messages || [])
    setHistoryOpen(false)
  }

  async function removeChat(event: React.MouseEvent, id: string) {
    event.stopPropagation()
    const response = await fetch(`/api/chat/${id}`, { method: 'DELETE' })
    if (!response.ok) return toast.error('Could not remove this conversation.')
    setSessions(items => items.filter(item => item.id !== id))
    if (chatId === id) startNew()
  }

  function startNew() {
    setChatId(undefined)
    setMessages([])
    setSources({})
    setUpload(undefined)
    setHistoryOpen(false)
  }

  function changeMode(next: 'medical' | 'student') {
    if (next === chatType) return
    startNew()
    setChatType(next)
    window.history.replaceState({}, '', next === 'student' ? '/chat?type=student' : '/chat')
  }

  async function copyMessage(message: Message) {
    await navigator.clipboard.writeText(message.content)
    setCopiedId(message.id)
    window.setTimeout(() => setCopiedId(undefined), 1_500)
  }

  const appendTranscript = useCallback((text: string) => {
    setInput(current => current ? `${current} ${text}` : text)
  }, [])

  async function attachFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const data = new FormData()
    data.append('file', file)
    const toastId = toast.loading('Reading the document…')
    const response = await fetch('/api/upload', { method: 'POST', body: data })
    const result = await response.json()
    toast.dismiss(toastId)
    if (!response.ok) return toast.error(result.error || 'This document could not be read.')
    setUpload(result)
    toast.success('Document ready. Identifiers should be removed before sending.')
    event.target.value = ''
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
    const timeout = window.setTimeout(() => controller.abort(), 45_000)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ message: content, chatSessionId: chatId, type: chatType, language, fileContent: upload })
      })
      const result = await readApiResult(response)
      if (response.status === 401 || result.code === 'AUTH_REQUIRED') {
        router.replace('/auth/signin?callbackUrl=/chat')
        throw new Error('Your session expired. Sign in again to continue.')
      }
      if (!response.ok) {
        const reference = result.requestId ? ` Reference: ${result.requestId}.` : ''
        throw new Error(`${result.error || 'A safe answer is unavailable right now.'}${reference}`)
      }
      const assistantMessage = result.message as Message
      const resultSources = result.sources as Source[] | undefined
      setChatId(result.chatSessionId as string)
      setMessages(items => [...items, { ...assistantMessage, role: 'assistant' }])
      if (resultSources?.length) setSources(items => ({ ...items, [assistantMessage.id]: resultSources }))
      setUpload(undefined)
      await loadSessions()
    } catch (reason) {
      setMessages(items => items.filter(item => item.id !== optimistic.id))
      setInput(content)
      toast.error(
        reason instanceof DOMException && reason.name === 'AbortError'
          ? 'The answer took too long. Please try again.'
          : reason instanceof Error ? reason.message : 'Unable to send this message.'
      )
    } finally {
      window.clearTimeout(timeout)
      setBusy(false)
    }
  }

  if (status === 'loading') return <div className="as-segment-loader" role="status">Opening your conversation…</div>

  return (
    <div className="as-chat-page">
      <Navbar />
      <main id="main-content" className="as-chat-shell">
        <aside className={`as-chat-history ${historyOpen ? 'is-open' : ''}`}>
          <div className="as-history-brand"><Image src="/arogya-mark.png" alt="" width={32} height={32} /><span><strong>Arogya</strong><small>Created by Adarsh</small></span></div>
          <div className="as-history-head"><span>Your threads</span><button onClick={() => setHistoryOpen(false)} aria-label="Close conversation history"><X /></button></div>
          <button className="as-new-chat" onClick={startNew}><MessageSquarePlus /> Start a new thread</button>
          <div className="as-history-list">
            {sessions.length ? sessions.map(session => <div key={session.id} className={chatId === session.id ? 'is-active' : ''}><button className="as-history-main" onClick={() => openChat(session.id)}><span><strong>{session.title}</strong><small>{new Date(session.updatedAt).toLocaleDateString()}</small></span></button><button className="as-history-delete" onClick={event => removeChat(event, session.id)} aria-label={`Delete ${session.title}`}><Trash2 /></button></div>) : <p>No saved conversations yet.</p>}
          </div>
          <div className="as-history-boundary"><ShieldCheck /><p>Messages are saved to your account. Avoid sharing identifiers you do not need for the question.</p></div>
        </aside>

        {historyOpen && <button className="as-history-scrim" onClick={() => setHistoryOpen(false)} aria-label="Close history" />}

        <section className="as-chat-workspace">
          <header className="as-chat-header">
            <div className="as-chat-title"><button className="as-chat-menu" onClick={() => setHistoryOpen(true)} aria-label="Open conversation history"><Menu /></button><Image src="/arogya-mark.png" alt="" width={28} height={28} /><span><strong>Arogya</strong><small>Gemini 3 Flash · evidence-aware</small></span></div>
            <div className="as-chat-controls">
              <div className="as-mode-switch" role="group" aria-label="Conversation mode">
                <button className={chatType === 'medical' ? 'is-active' : ''} onClick={() => changeMode('medical')} aria-pressed={chatType === 'medical'}><HeartPulse /> Health</button>
                <button className={chatType === 'student' ? 'is-active' : ''} onClick={() => changeMode('student')} aria-pressed={chatType === 'student'}><GraduationCap /> Study</button>
              </div>
              <label><span className="sr-only">Response language</span><select value={language} onChange={event => setLanguage(event.target.value)}>{languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
              <Link href="/dashboard" aria-label="Return to dashboard"><ChevronLeft /> Overview</Link>
            </div>
          </header>

          {chatType === 'medical' ? <div className="as-emergency-strip"><AlertTriangle /><span><strong>Possible emergency?</strong> Call 112 or go to the nearest emergency department. Do not wait here.</span></div> : <div className="as-study-strip"><BookOpen /><span>Generated teaching content should be checked against your current curriculum and primary sources.</span></div>}

          <div className="as-message-scroll">
            {!messages.length ? (
              <div className="as-chat-empty">
                <div className="as-chat-empty-brand"><div className="as-chat-empty-mark"><Image src="/arogya-mark.png" alt="" width={34} height={34} /></div><span><strong>Arogya</strong><small>Created by Adarsh</small></span></div>
                <span className="as-kicker">{chatType === 'student' ? 'Learn by reasoning, not memorising' : 'Clear context before conclusions'}</span>
                <h1>{chatType === 'student' ? 'What should we work through?' : 'What can I help you understand?'}</h1>
                <p>{chatType === 'student' ? 'I’ll set an objective, test what you recall, work through a case and help you close the gaps.' : 'I’ll ask for important context, retrieve relevant reviewed sources when available, and keep the next step clear. I cannot diagnose or replace a clinician.'}</p>
                <div className="as-chat-assurances"><span><ShieldCheck /> Emergency-aware</span><span><BookOpen /> Sources when available</span><span><Check /> Clear next steps</span></div>
                <div className="as-prompt-list">{(chatType === 'student' ? ['Teach cardiac output through a clinical case', 'Quiz me on autonomic pharmacology', 'Build a 25-minute active recall session'] : prompts).map(prompt => <button key={prompt} onClick={() => send(undefined, prompt)}>{prompt}<ArrowRight /></button>)}</div>
              </div>
            ) : (
              <div className="as-message-list">
                {messages.map(message => <article key={message.id} className={`as-message is-${message.role}`}>
                  <div className="as-message-avatar">{message.role === 'assistant' ? <Image src="/arogya-mark.png" alt="" width={20} height={20} /> : <UserRound />}</div>
                  <div className="as-message-content"><div className="as-message-meta"><span>{message.role === 'assistant' ? <><strong>Arogya</strong><small>by Adarsh</small></> : 'You'}</span><div><button onClick={() => copyMessage(message)} aria-label="Copy this message">{copiedId === message.id ? <Check /> : <Copy />}</button>{message.role === 'assistant' && <button onClick={() => speakText(message.content, language)} aria-label="Read this answer aloud"><Volume2 /></button>}</div></div><MessageRenderer content={message.content} />{sources[message.id]?.length ? <div className="as-source-list"><span><BookOpen /> Evidence consulted</span>{sources[message.id].map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><strong>{source.title}</strong><small>{source.publisher} · reviewed {source.reviewedAt}</small></a>)}</div> : null}</div>
                </article>)}
                {busy && <article className="as-message is-assistant"><div className="as-message-avatar"><Image src="/arogya-mark.png" alt="" width={20} height={20} /></div><div className="as-thinking"><i /><i /><i /><span>Reviewing context and evidence</span></div></article>}
                <div ref={endRef} />
              </div>
            )}
          </div>

          <div className="as-composer-wrap">
            {upload && <div className="as-upload-chip"><FileText /><span><strong>{upload.fileName}</strong>Ready to include with your next message</span><button onClick={() => setUpload(undefined)} aria-label="Remove attached document"><X /></button></div>}
            <form className="as-composer" onSubmit={event => send(event)}>
              <label className="as-attach-button" title="Attach a PDF or text document"><Paperclip /><span className="sr-only">Attach a PDF or text document</span><input type="file" accept="application/pdf,text/plain,.txt" onChange={attachFile} /></label>
              <textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send() } }} rows={1} maxLength={4000} placeholder="Describe your question or what you want to prepare for…" aria-label="Message" />
              <VoiceComposer language={language} disabled={busy} onTranscript={appendTranscript} />
              <button className="as-send-button" type="submit" disabled={!input.trim() || busy} aria-label="Send message"><Send /></button>
            </form>
            <p>Device voice uses browser speech and no app speech key. AI answers still use the provider configured by the operator. Educational guidance only.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
