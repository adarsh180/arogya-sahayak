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
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 lg:w-64 bg-white border-r border-gray-200 flex flex-col shadow-xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => {
              onNewChat()
              onClose()
            }}
            className="w-full flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {chatSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chat history yet</p>
              </div>
            ) : (
              chatSessions.map((session) => (
                <motion.div
                  key={session.id}
                  layout
                  className={`group relative p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    currentSessionId === session.id
                      ? 'bg-blue-50 border-2 border-blue-200'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                  onClick={() => {
                    onLoadSession(session.id)
                    onClose()
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <MessageCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {session.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {session.messages?.length || 0} messages
                      </p>
                    </div>
                    
                    <button
                      onClick={(e) => deleteSession(session.id, e)}
                      disabled={deletingId === session.id}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-lg transition-all duration-200 ml-2"
                    >
                      {deletingId === session.id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Language Selector */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="inline h-4 w-4 mr-1" />
            Language
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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