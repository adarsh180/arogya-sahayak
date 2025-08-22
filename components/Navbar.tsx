'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Heart, User, MessageCircle, Activity, GraduationCap, LogOut, Brain } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="bg-neutral-950/80 backdrop-blur-2xl shadow-lg border-b border-neutral-800/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-medical-500 rounded-full animate-pulse-soft"></div>
              </div>
              <span className="text-xl font-bold gradient-text">Arogya Sahayak</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {session ? (
              <>
                <Link href="/chat" className="nav-item flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden lg:inline">Medical Chat</span>
                </Link>
                <Link href="/student" className="nav-item flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden lg:inline">Student Corner</span>
                </Link>
                
                <Link href="/dashboard" className="nav-item flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
                <Link href="/profile" className="nav-item flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">Profile</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center space-x-2 text-neutral-300 hover:text-medical-400 px-3 py-2 rounded-xl hover:bg-medical-900/20 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="nav-item">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-xl hover:bg-neutral-800/60 transition-all duration-200 text-neutral-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden animate-slide-down">
          <div className="px-4 pt-2 pb-3 space-y-2 bg-neutral-950/80 backdrop-blur-2xl border-t border-neutral-800/40 shadow-lg">
            {session ? (
              <>
                <Link 
                  href="/chat" 
                  className="flex items-center space-x-3 px-4 py-3 text-neutral-300 hover:text-primary-400 hover:bg-neutral-800/60 rounded-2xl transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Medical Chat</span>
                </Link>
                <Link 
                  href="/student" 
                  className="flex items-center space-x-3 px-4 py-3 text-neutral-300 hover:text-primary-400 hover:bg-neutral-800/60 rounded-2xl transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <GraduationCap className="h-5 w-5" />
                  <span>Student Corner</span>
                </Link>
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-3 px-4 py-3 text-neutral-300 hover:text-primary-400 hover:bg-neutral-800/60 rounded-2xl transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Activity className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-3 px-4 py-3 text-neutral-300 hover:text-primary-400 hover:bg-neutral-800/60 rounded-2xl transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => { signOut({ callbackUrl: '/' }); setIsOpen(false); }}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 text-neutral-300 hover:text-medical-400 hover:bg-medical-900/20 rounded-2xl transition-all duration-200 font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="block px-4 py-3 text-neutral-300 hover:text-primary-400 hover:bg-neutral-800/60 rounded-2xl transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="block px-4 py-3 text-center btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}