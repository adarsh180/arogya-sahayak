'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Smile } from 'lucide-react'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export default function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        onSubmit(e as any)
      }
    }
  }

  return (
    <div className="sticky bottom-0 bg-neutral-950/80 backdrop-blur-2xl border-t border-neutral-800/40 p-4 lg:p-6 safe-area-bottom">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
        <div className={`relative flex flex-col sm:flex-row items-end space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-4 bg-neutral-900/90 backdrop-blur-xl rounded-3xl shadow-xl border transition-all duration-200 ${
          isFocused ? 'border-primary-600 shadow-2xl' : 'border-neutral-700/60'
        }`}>
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask about symptoms, medical reports, or health concerns..."
              className="w-full px-5 lg:px-6 py-4 lg:py-5 bg-transparent border-none outline-none resize-none text-base lg:text-lg placeholder-neutral-500 dark:placeholder-neutral-400 text-neutral-900 dark:text-neutral-100 min-h-[56px] max-h-[120px] font-medium"
              rows={1}
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pr-3 lg:pr-4 pb-4 lg:pb-5">
            {/* Emoji Button */}
            <button
              type="button"
              className="p-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 rounded-2xl transition-all duration-200"
              disabled={isLoading}
            >
              <Smile className="h-5 w-5" />
            </button>

            {/* Mic Button */}
            <button
              type="button"
              className="p-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 rounded-2xl transition-all duration-200"
              disabled={isLoading}
            >
              <Mic className="h-5 w-5" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`p-3 rounded-2xl transition-all duration-200 ${
                input.trim() && !isLoading
                  ? 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-medium hover:shadow-large active:scale-95'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3 text-center hidden sm:block font-medium">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  )
}