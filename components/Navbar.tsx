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
          <div className="hidden md:flex items-center space-x-8">
            {session ? (
              <>
                <Link href="/chat" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <MessageCircle className="h-4 w-4" />
                  <span>Medical Chat</span>
                </Link>
                <Link href="/symptom-checker" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <Activity className="h-4 w-4" />
                  <span>Symptom Checker</span>
                </Link>
                <Link href="/student" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <GraduationCap className="h-4 w-4" />
                  <span>Student Corner</span>
                </Link>
                <Link href="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <Activity className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600">
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {session ? (
              <>
                <Link href="/chat" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                  Medical Chat
                </Link>
                <Link href="/symptom-checker" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                  Symptom Checker
                </Link>
                <Link href="/student" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                  Student Corner
                </Link>
                <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link href="/profile" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
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