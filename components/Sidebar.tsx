'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Trash2, Plus, Globe, Menu } from 'lucide-react'
import { INDIAN_LANGUAGES } from '@/lib/ai'
import toast from 'react-hot-toast'

interface ChatSession {
  id: string
  title: string
  messages: any[]
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  chatSessions: ChatSession[]
  currentSessionId: string | null
  language: string
  onLanguageChange: (lang: string) => void
  onLoadSession: (sessionId: string) => void
  onNewChat: () => void
  onRefreshSessions: () => void
}

export default function Sidebar({
  isOpen,
  onClose,
  chatSessions,
  currentSessionId,
  language,
  onLanguageChange,
  onLoadSession,
  onNewChat,
  onRefreshSessions
}: SidebarProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this chat session?')) return

    setDeletingId(sessionId)
    try {
      const response = await fetch(`/api/chat/${sessionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Chat deleted successfully')
        onRefreshSessions()
        if (currentSessionId === sessionId) {
          onNewChat()
        }
      } else {
        toast.error('Failed to delete chat')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%'
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 200
        }}
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 lg:w-72 bg-neutral-950/80 backdrop-blur-2xl border-r border-neutral-800/40 flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800/40">
          <h2 className="text-lg font-semibold text-neutral-100">Chat History</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2.5 hover:bg-neutral-800/60 rounded-2xl transition-all duration-200 text-neutral-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-6 border-b border-neutral-800/40">
          <button
            onClick={() => {
              onNewChat()
              onClose()
            }}
            className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-2xl transition-all duration-200 shadow-medium hover:shadow-large active:scale-95 font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {chatSessions.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <MessageCircle className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p className="text-sm font-medium">No chat history yet</p>
              </div>
            ) : (
              chatSessions.map((session) => (
                <motion.div
                  key={session.id}
                  layout
                  className={`group relative p-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                    currentSessionId === session.id
                      ? 'bg-primary-900/30 border border-primary-700/60 shadow-lg'
                      : 'hover:bg-neutral-800/60 border border-transparent'
                  }`}
                  onClick={() => {
                    onLoadSession(session.id)
                    onClose()
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <MessageCircle className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-neutral-100 truncate">
                          {session.title}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-medium">
                        {session.messages?.length || 0} messages
                      </p>
                    </div>
                    
                    <button
                      onClick={(e) => deleteSession(session.id, e)}
                      disabled={deletingId === session.id}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-medical-900/30 rounded-xl transition-all duration-200 ml-2"
                    >
                      {deletingId === session.id ? (
                        <div className="w-4 h-4 border-2 border-medical-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-medical-500" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Language Selector */}
        <div className="p-6 border-t border-neutral-800/40 bg-neutral-900/50">
          <label className="block text-sm font-medium text-neutral-300 mb-3">
            <Globe className="inline h-4 w-4 mr-2" />
            Language
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/60 rounded-2xl focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/60 text-sm font-medium transition-all duration-200 text-neutral-100"
          >
            {Object.entries(INDIAN_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </motion.div>
    </>
  )
}