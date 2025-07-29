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
    <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 lg:p-4 safe-area-bottom">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
        <div className={`relative flex items-end space-x-2 lg:space-x-3 bg-white rounded-2xl lg:rounded-3xl shadow-lg border-2 transition-all duration-200 ${
          isFocused ? 'border-blue-300 shadow-xl' : 'border-gray-200'
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
              className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-transparent border-none outline-none resize-none text-sm lg:text-base placeholder-gray-500 min-h-[48px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 lg:space-x-2 pr-2 lg:pr-3 pb-3 lg:pb-4">
            {/* Emoji Button */}
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isLoading}
            >
              <Smile className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>

            {/* Mic Button */}
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isLoading}
            >
              <Mic className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`p-2 lg:p-3 rounded-full transition-all duration-200 ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4 lg:h-5 lg:w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 mt-2 text-center hidden sm:block">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  )
}