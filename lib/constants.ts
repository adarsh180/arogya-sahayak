// Shared, client-safe constants.

export const INDIAN_LANGUAGES = {
  en: 'English', hi: 'हिंदी', bn: 'বাংলা', te: 'తెలుగు', mr: 'मराठी', ta: 'தமிழ்',
  gu: 'ગુજરાતી', kn: 'ಕನ್ನಡ', ml: 'മലയാളം', pa: 'ਪੰਜਾਬੀ', or: 'ଓଡ଼ିଆ', as: 'অসমীয়া',
  ur: 'اردو', sa: 'संस्कृतम्', ne: 'नेपाली', kok: 'कोंकणी', mni: 'মৈতৈলোন্',
  sd: 'سنڌي', ks: 'कॉशुर', doi: 'डोगरी', mai: 'मैथिली', sat: 'ᱥᱟᱱᱛᱟᱲᱤ', brx: 'बड़ो'
} as const

export const MEDICAL_EXAMS = {
  'neet-ug': 'NEET UG', 'neet-pg': 'NEET PG', inicet: 'INI-CET', fmge: 'FMGE',
  'neet-ss': 'NEET SS', 'neet-mds': 'NEET MDS', 'aiims-nursing': 'AIIMS Nursing'
}

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const MEDICAL_YEARS = {
  'pre-medical': 'Pre-medical', '1st-year': '1st Year MBBS', '2nd-year': '2nd Year MBBS',
  '3rd-year': '3rd Year MBBS', '4th-year': 'Final Year MBBS', intern: 'Internship',
  'pg-1': 'PG 1st Year', 'pg-2': 'PG 2nd Year', 'pg-3': 'PG 3rd Year', resident: 'Resident'
}

/** Subjects offered for practice tests, per exam. */
export const EXAM_SUBJECTS: Record<string, string[]> = {
  'neet-ug': ['Physics', 'Chemistry', 'Botany', 'Zoology'],
  default: ['Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Microbiology', 'Forensic Medicine', 'Community Medicine', 'Ophthalmology', 'ENT', 'General Medicine', 'General Surgery', 'Obstetrics & Gynaecology', 'Paediatrics', 'Orthopaedics', 'Dermatology', 'Psychiatry', 'Radiology', 'Anaesthesia'],
  'neet-mds': ['Oral Pathology', 'Oral Medicine & Radiology', 'Conservative Dentistry', 'Orthodontics', 'Periodontics', 'Prosthodontics', 'Oral Surgery', 'Pedodontics', 'Public Health Dentistry', 'Dental Materials'],
  'aiims-nursing': ['Anatomy', 'Physiology', 'Nutrition', 'Microbiology', 'Medical-Surgical Nursing', 'Community Health Nursing', 'Child Health Nursing', 'Mental Health Nursing', 'Midwifery'],
}

export function subjectsFor(exam: string) {
  return EXAM_SUBJECTS[exam] || EXAM_SUBJECTS.default
}
