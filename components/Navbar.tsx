'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Heart, User, MessageCircle, Activity, GraduationCap, LogOut } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Heart className="h-8 w-8 text-medical-600 animate-pulse group-hover:animate-bounce transition-all duration-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping group-hover:animate-pulse"></div>
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-medical-600 transition-colors duration-300">Arogya Sahayak</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {session ? (
              <>
                <Link href="/chat" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 text-sm lg:text-base">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden lg:inline">Medical Chat</span>
                  <span className="lg:hidden">Chat</span>
                </Link>

                <Link href="/student" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 text-sm lg:text-base">
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden lg:inline">Student Corner</span>
                  <span className="lg:hidden">Study</span>
                </Link>
                <Link href="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 text-sm lg:text-base">
                  <Activity className="h-4 w-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                  <span className="lg:hidden">Home</span>
                </Link>
                <Link href="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 text-sm lg:text-base">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">Profile</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 text-sm lg:text-base"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600 text-sm lg:text-base">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
            {session ? (
              <>
                <Link 
                  href="/chat" 
                  className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Medical Chat</span>
                </Link>

                <Link 
                  href="/student" 
                  className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <GraduationCap className="h-5 w-5" />
                  <span>Student Corner</span>
                </Link>
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Activity className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => { signOut({ callbackUrl: '/' }); setIsOpen(false); }}
                  className="flex items-center space-x-3 w-full text-left px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="block px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="block px-3 py-3 text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-colors"
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