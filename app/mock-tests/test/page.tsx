'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, ClipboardCheck, Flag, Play, RotateCcw, Timer, X, XCircle
} from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { BrandLoader, EmptyState, Modal, Spinner, cx } from '@/components/ui/kit'
import { api, errorMessage } from '@/lib/client-api'
import { MEDICAL_EXAMS } from '@/lib/constants'

type Question = { question: string; options: string[]; correct: number; explanation: string }
type Result = { score: number; correctAnswers: number; attempted: number; totalQuestions: number; timeSpentSeconds: number; band: string; review: Array<{ selected: number | null; correct: number; isCorrect: boolean }> }
type Phase = 'loading' | 'error' | 'ready' | 'running' | 'submitting' | 'done'

const letters = ['A', 'B', 'C', 'D']
const clock = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

export default function MockTestPage() {
  return <AppShell loadingLabel="Opening your test"><Suspense fallback={null}><Runner /></Suspense></AppShell>
}

function Runner() {
  const router = useRouter()
  const params = useSearchParams()
  const exam = params.get('exam') || ''
  const subject = params.get('subject') || ''
  const count = Math.min(25, Math.max(3, Number(params.get('questions')) || 10))
  const minutes = Math.min(90, Math.max(5, Number(params.get('duration')) || 15))
  const examName = MEDICAL_EXAMS[exam as keyof typeof MEDICAL_EXAMS] || exam.toUpperCase()

  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flags, setFlags] = useState<Set<number>>(new Set())
  const [left, setLeft] = useState(minutes * 60)
  const [confirm, setConfirm] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const startedAt = useRef(0)
  const requested = useRef(false)

  const generate = useCallback(async () => {
    setPhase('loading')
    setError('')
    try {
      const data = await api<{ questions: Question[] }>('/api/mock-tests/generate', { method: 'POST', json: { exam: examName, subject, questionCount: count } })
      setQuestions(data.questions)
      setAnswers({})
      setFlags(new Set())
      setCurrent(0)
      setLeft(minutes * 60)
      setPhase('ready')
    } catch (reason) {
      setError(errorMessage(reason, 'Questions could not be generated right now.'))
      setPhase('error')
    }
  }, [count, examName, minutes, subject])

  useEffect(() => {
    if (!exam || !subject) { router.replace('/mock-tests'); return }
    if (requested.current) return
    requested.current = true
    generate()
  }, [exam, generate, router, subject])

  const submit = useCallback(async () => {
    setConfirm(false)
    setPhase('submitting')
    try {
      const timeSpentSeconds = Math.round((Date.now() - startedAt.current) / 1000)
      const data = await api<Result>('/api/mock-tests/submit', { method: 'POST', json: { exam, subject, questions, answers, timeSpentSeconds } })
      setResult(data)
      setPhase('done')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (reason) {
      toast.error(errorMessage(reason, 'Your answers could not be submitted.'))
      setPhase('running')
    }
  }, [answers, exam, questions, subject])

  useEffect(() => {
    if (phase !== 'running') return
    const timer = window.setInterval(() => setLeft(value => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase === 'running' && left === 0) {
      toast('Time is up — submitting your answers.', { icon: '⏱️' })
      submit()
    }
  }, [left, phase, submit])

  useEffect(() => {
    if (phase !== 'running') return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [phase])

  useEffect(() => {
    if (phase !== 'running') return
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest('input, textarea, select')) return
      const index = ['1', '2', '3', '4', 'a', 'b', 'c', 'd'].indexOf(event.key.toLowerCase())
      if (index >= 0) setAnswers(items => ({ ...items, [current]: index % 4 }))
      if (event.key === 'ArrowRight') setCurrent(value => Math.min(questions.length - 1, value + 1))
      if (event.key === 'ArrowLeft') setCurrent(value => Math.max(0, value - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, phase, questions.length])

  if (phase === 'loading') return <BrandLoader label={`Writing ${count} ${subject} questions…`} />

  if (phase === 'error') {
    return (
      <div className="ui-card mt-run-error">
        <EmptyState icon={AlertTriangle} title="We couldn’t prepare this test" action={<div className="flex flex-wrap justify-center gap-2"><button type="button" className="ui-btn" onClick={generate}><RotateCcw /> Try again</button><Link href="/mock-tests" className="ui-btn ui-btn-secondary">Choose another test</Link></div>}>
          {error} No placeholder questions were substituted.
        </EmptyState>
      </div>
    )
  }

  if (phase === 'ready') {
    return (
      <section className="ui-card mt-intro ui-rise">
        <span className="ui-kicker">{examName}</span>
        <h1>{subject}</h1>
        <div className="mt-intro-facts">
          <span><ClipboardCheck /> {questions.length} questions</span>
          <span><Timer /> {minutes} minutes</span>
          <span><Flag /> Flag questions to revisit</span>
        </div>
        <ul>
          <li>Pick one answer per question. Keys <kbd>1</kbd>–<kbd>4</kbd> select options; arrow keys move between questions.</li>
          <li>The test submits automatically when time runs out.</li>
          <li>You’ll see the correct answer and an explanation for every question at the end.</li>
        </ul>
        <div className="mt-intro-actions">
          <Link href="/mock-tests" className="ui-btn ui-btn-secondary"><ArrowLeft /> Back</Link>
          <button type="button" className="ui-btn ui-btn-lg" onClick={() => { startedAt.current = Date.now(); setPhase('running') }}><Play /> Begin test</button>
        </div>
      </section>
    )
  }

  if (phase === 'done' && result) {
    const tone = result.score >= 70 ? 'is-good' : result.score >= 50 ? 'is-mid' : 'is-low'
    return (
      <div className="mt-results">
        <section className="ui-card mt-score ui-rise">
          <div className={cx('mt-score-ring', tone)} style={{ '--p': result.score } as React.CSSProperties}><strong className="ui-num">{result.score}<small>%</small></strong></div>
          <div className="mt-score-copy">
            <span className="ui-kicker">{examName} · {subject}</span>
            <h1>{result.band}</h1>
            <p>{result.correctAnswers} correct of {result.totalQuestions} · {result.attempted} attempted · {clock(result.timeSpentSeconds)} taken</p>
            <div className="mt-intro-actions">
              <button type="button" className="ui-btn" onClick={() => { requested.current = true; generate() }}><RotateCcw /> New test, same subject</button>
              <Link href="/analytics" className="ui-btn ui-btn-secondary">View progress</Link>
            </div>
          </div>
        </section>

        <h2 className="mt-review-title">Answer review</h2>
        <div className="mt-review">
          {questions.map((question, index) => {
            const review = result.review[index]
            return (
              <article key={index} className={cx('ui-card mt-review-item', review?.isCorrect ? 'is-right' : 'is-wrong')}>
                <header>
                  <span className="mt-q-num">Q{index + 1}</span>
                  {review?.isCorrect ? <span className="ui-badge is-ok"><CheckCircle2 /> Correct</span> : review?.selected === null ? <span className="ui-badge">Not answered</span> : <span className="ui-badge is-danger"><XCircle /> Incorrect</span>}
                </header>
                <p className="mt-q-text">{question.question}</p>
                <ol className="mt-review-options">
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex} className={cx(optionIndex === question.correct && 'is-correct', optionIndex === review?.selected && optionIndex !== question.correct && 'is-chosen')}>
                      <b>{letters[optionIndex]}</b><span>{option}</span>
                      {optionIndex === question.correct ? <Check /> : optionIndex === review?.selected ? <X /> : null}
                    </li>
                  ))}
                </ol>
                <div className="mt-explain"><strong>Why</strong><p>{question.explanation}</p></div>
              </article>
            )
          })}
        </div>
      </div>
    )
  }

  const question = questions[current]
  const answered = Object.keys(answers).length
  const unanswered = questions.length - answered
  const lowTime = left <= 60

  return (
    <div className="mt-run">
      <header className="mt-run-bar">
        <div><span className="ui-card-label">{examName} · {subject}</span><strong>Question {current + 1} of {questions.length}</strong></div>
        <div className={cx('mt-timer', lowTime && 'is-low')} role="timer" aria-live={lowTime ? 'assertive' : 'off'}><Timer /><span className="ui-num">{clock(left)}</span></div>
        <button type="button" className="ui-btn ui-btn-sm" onClick={() => setConfirm(true)} disabled={phase === 'submitting'}>{phase === 'submitting' ? <><Spinner /> Submitting…</> : 'Submit'}</button>
      </header>
      <div className="ui-progress mt-run-progress" aria-hidden="true"><i style={{ width: `${(answered / questions.length) * 100}%` }} /></div>

      <div className="mt-run-layout">
        <section className="ui-card mt-question" key={current}>
          <div className="mt-question-head">
            <span className="mt-q-num">Q{current + 1}</span>
            <button type="button" className={cx('ui-chip', flags.has(current) && 'is-flagged')} aria-pressed={flags.has(current)} onClick={() => setFlags(items => { const next = new Set(items); if (next.has(current)) next.delete(current); else next.add(current); return next })}><Flag /> {flags.has(current) ? 'Flagged' : 'Flag'}</button>
          </div>
          <p className="mt-q-text">{question.question}</p>
          <div className="mt-options" role="radiogroup" aria-label={`Answers for question ${current + 1}`}>
            {question.options.map((option, index) => (
              <button key={index} type="button" role="radio" aria-checked={answers[current] === index} className={cx('mt-option', answers[current] === index && 'is-selected')} onClick={() => setAnswers(items => ({ ...items, [current]: index }))}>
                <b>{letters[index]}</b><span>{option}</span>
              </button>
            ))}
          </div>
          <div className="mt-nav">
            <button type="button" className="ui-btn ui-btn-secondary" onClick={() => setCurrent(value => value - 1)} disabled={current === 0}><ArrowLeft /> Previous</button>
            {current < questions.length - 1
              ? <button type="button" className="ui-btn" onClick={() => setCurrent(value => value + 1)}>Next <ArrowRight /></button>
              : <button type="button" className="ui-btn" onClick={() => setConfirm(true)}>Finish <Check /></button>}
          </div>
        </section>

        <aside className="ui-card ui-card-pad mt-map">
          <span className="ui-card-label">Question map</span>
          <div className="mt-map-grid">
            {questions.map((_, index) => (
              <button key={index} type="button" onClick={() => setCurrent(index)} aria-label={`Go to question ${index + 1}`} aria-current={index === current ? 'true' : undefined}
                className={cx(answers[index] !== undefined && 'is-answered', flags.has(index) && 'is-flagged', index === current && 'is-current')}>{index + 1}</button>
            ))}
          </div>
          <div className="mt-map-legend"><span><i className="is-answered" /> Answered {answered}</span><span><i className="is-flagged" /> Flagged {flags.size}</span><span><i /> Left {unanswered}</span></div>
        </aside>
      </div>

      <Modal open={confirm} onOpenChange={setConfirm} title="Submit your test?" description={unanswered ? `${unanswered} question${unanswered === 1 ? ' is' : 's are'} still unanswered${flags.size ? ` and ${flags.size} flagged` : ''}.` : 'All questions are answered.'}
        footer={<><button type="button" className="ui-btn ui-btn-secondary" onClick={() => setConfirm(false)}>Keep working</button><button type="button" className="ui-btn" onClick={submit}>Submit now</button></>}>
        <p className="ui-muted" style={{ margin: 0 }}>You still have {clock(left)} remaining. After submitting you’ll see every answer with an explanation.</p>
      </Modal>
    </div>
  )
}
