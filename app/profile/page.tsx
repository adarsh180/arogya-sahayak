'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar, MapPin, Edit, Save, Sparkles, Globe } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { GlassCard, FloatingOrb, MagneticButton } from '@/components/ui/DesignSystem'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    location: '',
    preferredLanguage: '',
    userType: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
          location: data.location || '',
          preferredLanguage: data.preferredLanguage || '',
          userType: data.userType || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      if (res.ok) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
        fetchProfile()
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center pt-20">
        <div className="spinner-aurora" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden pt-24 pb-12">
      <FloatingOrb color="purple" size="lg" className="fixed -right-48 top-1/4 -z-10" delay={0} />
      <FloatingOrb color="cyan" size="md" className="fixed -left-32 bottom-1/3 -z-10" delay={2} />

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <GlassCard className="inline-flex items-center gap-2 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-zinc-400">Your Profile</span>
            </GlassCard>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-zinc-50 mb-3">
            Profile <span className="text-gradient-aurora">Settings</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <GlassCard variant="strong" className="p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-semibold text-zinc-100 mb-2">
                {profile.name || 'User'}
              </h2>
              <p className="text-sm text-zinc-500 mb-2">{profile.email}</p>
              {profile.userType && (
                <span className="inline-block px-3 py-1 rounded-full glass-card text-xs font-medium text-purple-400 border border-purple-500/30 mb-6">
                  {profile.userType}
                </span>
              )}

              <MagneticButton
                variant={isEditing ? 'secondary' : 'primary'}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="spinner-aurora w-4 h-4" />
                    Saving...
                  </span>
                ) : isEditing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </span>
                )}
              </MagneticButton>
            </GlassCard>
          </div>

          {/* Details Grid */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-4">
              <ProfileField
                icon={<User className="w-5 h-5" />}
                label="Full Name"
                value={profile.name}
                isEditing={isEditing}
                onChange={(v: string) => setProfile({ ...profile, name: v })}
              />

              <ProfileField
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                value={profile.email}
                isEditing={false}
              />

              <ProfileField
                icon={<Phone className="w-5 h-5" />}
                label="Phone Number"
                value={profile.phone}
                isEditing={isEditing}
                onChange={(v: string) => setProfile({ ...profile, phone: v })}
              />

              <ProfileField
                icon={<Calendar className="w-5 h-5" />}
                label="Age"
                value={profile.age}
                isEditing={isEditing}
                onChange={(v: string) => setProfile({ ...profile, age: v })}
                type="number"
              />

              <ProfileField
                icon={<User className="w-5 h-5" />}
                label="Gender"
                value={profile.gender}
                isEditing={isEditing}
                onChange={(v: string) => setProfile({ ...profile, gender: v })}
              />

              <ProfileField
                icon={<Globe className="w-5 h-5" />}
                label="Preferred Language"
                value={profile.preferredLanguage}
                isEditing={isEditing}
                onChange={(v: string) => setProfile({ ...profile, preferredLanguage: v })}
              />

              <div className="md:col-span-2">
                <ProfileField
                  icon={<MapPin className="w-5 h-5" />}
                  label="Location"
                  value={profile.location}
                  isEditing={isEditing}
                  onChange={(v: string) => setProfile({ ...profile, location: v })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileField({
  icon,
  label,
  value,
  isEditing,
  onChange,
  type = 'text'
}: {
  icon: React.ReactNode
  label: string
  value: string
  isEditing: boolean
  onChange?: (value: string) => void
  type?: string
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-400/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-purple-400">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">
            {label}
          </label>
          {isEditing && onChange ? (
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-zinc-900/50 text-zinc-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-zinc-800"
            />
          ) : (
            <p className="text-base font-medium text-zinc-100 break-words">
              {value || <span className="text-zinc-600">Not set</span>}
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  )
}