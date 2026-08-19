'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff } from 'lucide-react'

const localeMap: Record<string, string> = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN', mr: 'mr-IN', ta: 'ta-IN',
  gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', or: 'or-IN', ur: 'ur-IN'
}

export default function VoiceComposer({ language, disabled, onTranscript }: {
  language: string
  disabled?: boolean
  onTranscript: (text: string) => void
}) {
  const recognition = useRef<SpeechRecognition | null>(null)
  const [supported, setSupported] = useState(true)
  const [listening, setListening] = useState(false)

  useEffect(() => {
    const Constructor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Constructor) {
      setSupported(false)
      return
    }
    const instance = new Constructor()
    instance.continuous = false
    instance.interimResults = false
    instance.onresult = event => {
      const text = Array.from(event.results).map(result => result[0]?.transcript || '').join(' ').trim()
      if (text) onTranscript(text)
    }
    instance.onerror = () => setListening(false)
    instance.onend = () => setListening(false)
    recognition.current = instance
    return () => instance.abort()
  }, [onTranscript])

  function toggle() {
    if (!recognition.current) return
    if (listening) {
      recognition.current.stop()
      setListening(false)
    } else {
      recognition.current.lang = localeMap[language] || 'en-IN'
      recognition.current.start()
      setListening(true)
    }
  }

  return (
    <button
      type="button"
      className={`as-voice-button ${listening ? 'is-listening' : ''}`}
      onClick={toggle}
      disabled={disabled || !supported}
      aria-label={!supported ? 'Voice input is not supported by this browser' : listening ? 'Stop listening' : 'Speak your message'}
      title={!supported ? 'Voice input is unavailable in this browser' : 'Device speech input — no app API key'}
    >
      {listening ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
      {listening && <span aria-hidden="true" />}
    </button>
  )
}

export function speakText(text: string, language: string) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text.replace(/https?:\/\/\S+/g, ''))
  utterance.lang = localeMap[language] || 'en-IN'
  utterance.rate = .96
  window.speechSynthesis.speak(utterance)
  return true
}
