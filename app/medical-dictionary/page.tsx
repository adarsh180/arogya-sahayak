'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowRight, BookA, Clock, Lightbulb, Languages, Search, Star, Volume2, X } from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { EmptyState, PageHeader, Skeleton, Spinner, cx } from '@/components/ui/kit'
import { api, errorMessage } from '@/lib/client-api'

type Term = { id: string; term: string; pronunciation?: string; definition: string; simple?: string; hindi?: string; category?: string; difficulty?: string; examples?: string[]; relatedTerms?: string[] }

const categories = ['all', 'anatomy', 'cardiology', 'neurology', 'pharmacology', 'pathology', 'ophthalmology', 'general']
const suggestions = ['Hypertension', 'Anaemia', 'Tachycardia', 'HbA1c', 'Thyroid', 'Dyspnoea']
const HISTORY_KEY = 'arogya:dictionary-history'
const CACHE_KEY = 'arogya:dictionary-cache'

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const titleFromSlug = (value: string) => value.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')

function readJSON<T>(key: string, fallback: T, storage: 'local' | 'session' = 'local'): T {
  try { return JSON.parse((storage === 'local' ? localStorage : sessionStorage).getItem(key) || '') as T } catch { return fallback }
}

export default function DictionaryPage() {
  return <AppShell loadingLabel="Opening the dictionary"><Dictionary /></AppShell>
}

function Dictionary() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [result, setResult] = useState<Term | null>(null)
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    api<{ favorites: string[] }>('/api/medical-dictionary/favorites').then(data => setFavorites(data.favorites || [])).catch(() => undefined)
    setHistory(readJSON<string[]>(HISTORY_KEY, []))
  }, [])

  const lookup = useCallback(async (raw: string) => {
    const term = raw.trim()
    if (term.length < 2) return toast.error('Type at least two letters.')
    setQuery(term)
    const cacheKey = `${slug(term)}|${category}`
    const cache = readJSON<Record<string, Term>>(CACHE_KEY, {}, 'session')
    const remember = (found: Term) => {
      setHistory(current => {
        const next = [found.term, ...current.filter(item => item.toLowerCase() !== found.term.toLowerCase())].slice(0, 8)
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)) } catch {}
        return next
      })
    }
    if (cache[cacheKey]) { setResult(cache[cacheKey]); remember(cache[cacheKey]); return }
    setLoading(true)
    try {
      const data = await api<{ results: Term[] }>('/api/medical-dictionary/search', { method: 'POST', json: { term, category } })
      const found = data.results?.[0]
      if (!found) throw new Error('No definition was found for that term.')
      setResult(found)
      remember(found)
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...cache, [cacheKey]: found })) } catch {}
    } catch (reason) {
      toast.error(errorMessage(reason, 'That term could not be looked up right now.'))
    } finally {
      setLoading(false)
    }
  }, [category])

  async function toggleFavorite(term: Term) {
    const termId = slug(term.term)
    try {
      const data = await api<{ added: boolean; favorites: string[] }>('/api/medical-dictionary/favorites', { method: 'POST', json: { termId } })
      setFavorites(data.favorites)
      toast.success(data.added ? 'Saved to favourites' : 'Removed from favourites')
    } catch (reason) {
      toast.error(errorMessage(reason))
    }
  }

  function speak(text: string) {
    if (!('speechSynthesis' in window)) return toast.error('Read-aloud is not supported in this browser.')
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-IN'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    lookup(query)
  }

  const isFavorite = result ? favorites.includes(slug(result.term)) : false

  return (
    <>
      <PageHeader kicker="Medical dictionary" title="Understand the words your report uses." description="Look up any medical term for a precise definition, a plain-language explanation and related concepts." />

      <form className="dict-search ui-rise" onSubmit={submit} role="search">
        <div className="ui-input-group dict-input">
          <Search />
          <input className="ui-input" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a term — e.g. tachycardia, HbA1c, creatinine" aria-label="Medical term" maxLength={100} />
          {query && <button type="button" className="ui-icon-btn" onClick={() => { setQuery(''); setResult(null) }} aria-label="Clear search"><X /></button>}
        </div>
        <select className="ui-select dict-category" value={category} onChange={event => setCategory(event.target.value)} aria-label="Category">
          {categories.map(item => <option key={item} value={item}>{item === 'all' ? 'All categories' : item.charAt(0).toUpperCase() + item.slice(1)}</option>)}
        </select>
        <button type="submit" className="ui-btn ui-btn-lg" disabled={loading}>{loading ? <Spinner /> : <Search />} Look up</button>
      </form>

      <div className="dict-layout">
        <section className="dict-result">
          {loading ? (
            <div className="ui-card ui-card-pad grid gap-3"><Skeleton height={40} width="50%" /><Skeleton height={18} width="30%" /><Skeleton height={90} /><Skeleton height={60} /></div>
          ) : result ? (
            <article className="ui-card dict-entry ui-rise">
              <header>
                <div>
                  <div className="dict-tags">
                    {result.category && <span className="ui-badge is-bare">{result.category}</span>}
                    {result.difficulty && <span className="ui-badge is-bare is-gold">{result.difficulty}</span>}
                  </div>
                  <h2>{result.term}</h2>
                  <p className="dict-pron">
                    {result.pronunciation && <span>/{result.pronunciation}/</span>}
                    {result.hindi && <span className="dict-hindi"><Languages /> {result.hindi}</span>}
                  </p>
                </div>
                <div className="dict-actions">
                  <button type="button" className="ui-icon-btn is-outlined" onClick={() => speak(result.term)} aria-label="Pronounce"><Volume2 /></button>
                  <button type="button" className={cx('ui-icon-btn is-outlined dict-star', isFavorite && 'is-on')} onClick={() => toggleFavorite(result)} aria-pressed={isFavorite} aria-label={isFavorite ? 'Remove from favourites' : 'Save to favourites'}><Star /></button>
                </div>
              </header>
              <section>
                <h3>Definition</h3>
                <p>{result.definition}</p>
              </section>
              {result.simple && (
                <section className="dict-simple">
                  <Lightbulb />
                  <div><h3>In plain words</h3><p>{result.simple}</p></div>
                </section>
              )}
              {result.examples?.length ? (
                <section>
                  <h3>In context</h3>
                  <ul>{result.examples.map(example => <li key={example}>{example}</li>)}</ul>
                </section>
              ) : null}
              {result.relatedTerms?.length ? (
                <section>
                  <h3>Related terms</h3>
                  <div className="dict-chips">{result.relatedTerms.map(term => <button key={term} type="button" className="ui-chip" onClick={() => lookup(term)}>{term}<ArrowRight /></button>)}</div>
                </section>
              ) : null}
              <p className="dict-note">AI-generated reference for learning. Your clinician’s explanation of your own results takes priority.</p>
            </article>
          ) : (
            <div className="ui-card">
              <EmptyState icon={BookA} title="Start with a word">
                Try one of these, or type any term from a prescription or lab report.
              </EmptyState>
              <div className="dict-chips is-centered">{suggestions.map(term => <button key={term} type="button" className="ui-chip" onClick={() => lookup(term)}>{term}</button>)}</div>
            </div>
          )}
        </section>

        <aside className="dict-side">
          <section className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">Saved</span><h3>Favourites</h3></div><Star /></div>
            {favorites.length ? <div className="dict-chips">{favorites.map(id => <button key={id} type="button" className="ui-chip" onClick={() => lookup(titleFromSlug(id))}>{titleFromSlug(id)}</button>)}</div> : <p className="ui-faint dict-side-empty">Star a term to keep it here.</p>}
          </section>
          <section className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">This device</span><h3>Recent searches</h3></div><Clock /></div>
            {history.length ? (
              <>
                <div className="dict-chips">{history.map(term => <button key={term} type="button" className="ui-chip" onClick={() => lookup(term)}>{term}</button>)}</div>
                <button type="button" className="ui-btn ui-btn-ghost ui-btn-sm dict-clear" onClick={() => { setHistory([]); try { localStorage.removeItem(HISTORY_KEY) } catch {} }}>Clear history</button>
              </>
            ) : <p className="ui-faint dict-side-empty">Your recent look-ups appear here.</p>}
          </section>
        </aside>
      </div>
    </>
  )
}
