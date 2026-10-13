'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { BookOpen, HeartPulse, LogOut, Moon, Save, ShieldCheck, Sun, UserRound } from 'lucide-react'
import AppShell from '@/components/shell/AppShell'
import { PageHeader, Segmented, Skeleton, Spinner } from '@/components/ui/kit'
import { useTheme } from '@/contexts/ThemeContext'
import { api, errorMessage } from '@/lib/client-api'
import { MEDICAL_EXAMS, MEDICAL_YEARS } from '@/lib/constants'

type Profile = Record<string, string>
type Mode = 'patient' | 'student'

const languages = [
  ['en', 'English'], ['hi', 'हिंदी (Hindi)'], ['bn', 'বাংলা (Bengali)'], ['te', 'తెలుగు (Telugu)'], ['mr', 'मराठी (Marathi)'], ['ta', 'தமிழ் (Tamil)'],
  ['gu', 'ગુજરાતી (Gujarati)'], ['kn', 'ಕನ್ನಡ (Kannada)'], ['ml', 'മലയാളം (Malayalam)'], ['pa', 'ਪੰਜਾਬੀ (Punjabi)'], ['or', 'ଓଡ଼ିଆ (Odia)'], ['ur', 'اردو (Urdu)']
]
const fields = ['name', 'phone', 'age', 'gender', 'location', 'preferredLanguage', 'userType', 'height', 'weight', 'bloodGroup', 'allergies', 'chronicConditions', 'currentMedications', 'targetExam', 'currentYear', 'medicalCollege']

export default function ProfilePage() {
  return <AppShell loadingLabel="Opening your profile"><ProfileForm /></AppShell>
}

function ProfileForm() {
  const { update } = useSession()
  const { theme, setTheme } = useTheme()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [memberSince, setMemberSince] = useState('')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    api<Record<string, unknown>>('/api/user/profile').then(data => {
      setEmail(String(data.email || ''))
      setMemberSince(String(data.createdAt || ''))
      setProfile(Object.fromEntries(fields.map(field => [field, data[field] === null || data[field] === undefined ? '' : String(data[field])])))
    }).catch(reason => toast.error(errorMessage(reason)))
  }, [])

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const set = (key: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfile(current => ({ ...(current || {}), [key]: event.target.value }))
    setDirty(true)
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!profile) return
    setSaving(true)
    try {
      await api('/api/user/profile', { method: 'PUT', json: profile })
      await update()
      setDirty(false)
      toast.success('Profile saved')
    } catch (reason) {
      toast.error(errorMessage(reason))
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return <div className="grid gap-4"><Skeleton height={60} width="40%" /><Skeleton height={220} /><Skeleton height={220} /></div>

  const initials = (profile.name || email).split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('')
  const mode = (profile.userType || 'patient') as Mode

  return (
    <form onSubmit={save} className="prof">
      <PageHeader
        kicker="Profile"
        title="Your details, your control."
        description="Information here helps Arogya personalise answers. Everything except your name is optional."
        actions={<button type="submit" className="ui-btn" disabled={saving || !dirty}>{saving ? <><Spinner /> Saving…</> : <><Save /> Save changes</>}</button>}
      />

      <div className="prof-layout">
        <aside className="prof-side">
          <div className="ui-card ui-card-pad prof-id">
            <span className="prof-avatar" aria-hidden="true">{initials || <UserRound />}</span>
            <strong>{profile.name || 'Your name'}</strong>
            <small>{email}</small>
            {memberSince && <small className="ui-faint">Member since {new Date(memberSince).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</small>}
          </div>
          <div className="ui-card ui-card-pad prof-prefs">
            <span className="ui-card-label">Appearance</span>
            <Segmented label="Theme" value={theme} onChange={value => setTheme(value)} options={[{ value: 'light', label: 'Light', icon: Sun }, { value: 'dark', label: 'Dark', icon: Moon }, { value: 'system', label: 'Auto' }]} />
            <span className="ui-card-label">Focus</span>
            <Segmented<Mode> label="Primary focus" value={mode} onChange={value => { setProfile({ ...profile, userType: value }); setDirty(true) }} options={[{ value: 'patient', label: 'Health', icon: HeartPulse }, { value: 'student', label: 'Learning', icon: BookOpen }]} />
          </div>
          <div className="ui-alert"><ShieldCheck /><span>Health details are stored in your account and used only to personalise answers. Read the <Link href="/privacy" className="ui-link">privacy notice</Link>.</span></div>
          <button type="button" className="ui-btn ui-btn-secondary" onClick={() => signOut({ callbackUrl: '/' })}><LogOut /> Sign out</button>
        </aside>

        <div className="prof-main">
          <section className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">About you</span><h2>Personal details</h2></div></div>
            <div className="ui-form-grid">
              <label className="ui-field"><span>Full name</span><input className="ui-input" required minLength={2} maxLength={100} value={profile.name} onChange={set('name')} autoComplete="name" /></label>
              <label className="ui-field"><span>Email</span><input className="ui-input" value={email} disabled /></label>
              <label className="ui-field"><span>Phone</span><input className="ui-input" type="tel" inputMode="tel" placeholder="+91 98765 43210" value={profile.phone} onChange={set('phone')} autoComplete="tel" /></label>
              <label className="ui-field"><span>Age</span><input className="ui-input" type="number" min={13} max={120} value={profile.age} onChange={set('age')} /></label>
              <label className="ui-field"><span>Gender</span><select className="ui-select" value={profile.gender} onChange={set('gender')}><option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Other</option></select></label>
              <label className="ui-field"><span>City or district</span><input className="ui-input" maxLength={120} value={profile.location} onChange={set('location')} autoComplete="address-level2" /></label>
              <label className="ui-field is-wide"><span>Preferred language for answers</span><select className="ui-select" value={profile.preferredLanguage || 'en'} onChange={set('preferredLanguage')}>{languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
            </div>
          </section>

          <section className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">Optional</span><h2>Health background</h2><p>Helps Arogya flag interactions and ask better follow-up questions.</p></div></div>
            <div className="ui-form-grid">
              <label className="ui-field"><span>Height (cm)</span><input className="ui-input" type="number" step="0.1" min={60} max={260} value={profile.height} onChange={set('height')} /></label>
              <label className="ui-field"><span>Weight (kg)</span><input className="ui-input" type="number" step="0.1" min={15} max={500} value={profile.weight} onChange={set('weight')} /></label>
              <label className="ui-field"><span>Blood group</span><select className="ui-select" value={profile.bloodGroup} onChange={set('bloodGroup')}><option value="">Not sure</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => <option key={group}>{group}</option>)}</select></label>
              <label className="ui-field"><span>Allergies</span><input className="ui-input" maxLength={1000} placeholder="e.g. penicillin, peanuts" value={profile.allergies} onChange={set('allergies')} /></label>
              <label className="ui-field is-wide"><span>Long-term conditions</span><input className="ui-input" maxLength={1000} placeholder="e.g. type 2 diabetes, asthma" value={profile.chronicConditions} onChange={set('chronicConditions')} /></label>
              <label className="ui-field is-wide"><span>Current medicines</span><textarea className="ui-textarea" maxLength={2000} rows={3} placeholder="Name and dose, one per line" value={profile.currentMedications} onChange={set('currentMedications')} /></label>
            </div>
          </section>

          <section className="ui-card ui-card-pad">
            <div className="ui-card-head"><div><span className="ui-card-label">Optional</span><h2>Learning profile</h2><p>Used to pitch study sessions, plans and mock tests at the right level.</p></div></div>
            <div className="ui-form-grid">
              <label className="ui-field"><span>Target exam</span><select className="ui-select" value={profile.targetExam} onChange={set('targetExam')}><option value="">Not preparing</option>{Object.entries(MEDICAL_EXAMS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="ui-field"><span>Current stage</span><select className="ui-select" value={profile.currentYear} onChange={set('currentYear')}><option value="">Select</option>{Object.entries(MEDICAL_YEARS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="ui-field is-wide"><span>College or institution</span><input className="ui-input" maxLength={180} value={profile.medicalCollege} onChange={set('medicalCollege')} /></label>
            </div>
          </section>

          <div className="prof-savebar">
            <span>{dirty ? 'You have unsaved changes.' : 'All changes saved.'}</span>
            <button type="submit" className="ui-btn" disabled={saving || !dirty}>{saving ? <><Spinner /> Saving…</> : <><Save /> Save changes</>}</button>
          </div>
        </div>
      </div>
    </form>
  )
}
