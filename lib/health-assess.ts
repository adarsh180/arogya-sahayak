import { MEDICAL_DISCLAIMER } from '@/lib/medical-safety'

export const METRIC_TYPES = ['bmi', 'blood_pressure', 'glucose', 'heart_rate'] as const
export type MetricType = typeof METRIC_TYPES[number]

export type Assessment = {
  status: 'normal' | 'warning' | 'danger'
  message: string
  suggestion: string
  medicalContext: string
  disclaimer: string
}

function number(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function assess(type: string, value: Record<string, string | number>): Assessment {
  const base = { disclaimer: MEDICAL_DISCLAIMER }

  if (type === 'bmi') {
    const bmi = number(value.bmi) ?? ((number(value.weight) || 0) / Math.pow((number(value.height) || 0) / 100, 2))
    if (!Number.isFinite(bmi) || bmi < 8 || bmi > 80) throw new Error('Enter a valid height and weight.')
    if (bmi < 18.5 || bmi >= 30) return { ...base, status: 'warning', message: `Your calculated BMI is ${bmi.toFixed(1)}.`, suggestion: 'Use this as a screening value and discuss it with a clinician, especially if weight has changed unexpectedly.', medicalContext: 'BMI is a population-level screening measure and does not directly measure body fat or account for every body type.' }
    if (bmi >= 25) return { ...base, status: 'warning', message: `Your calculated BMI is ${bmi.toFixed(1)}.`, suggestion: 'Consider a sustainable nutrition and activity plan with professional advice suited to your health history.', medicalContext: 'BMI between 25 and 29.9 is commonly classified as above the reference range for adults, but individual assessment matters.' }
    return { ...base, status: 'normal', message: `Your calculated BMI is ${bmi.toFixed(1)}.`, suggestion: 'Continue balanced meals, regular movement and periodic monitoring.', medicalContext: 'This result is within the common adult reference range; it is not a diagnosis.' }
  }

  if (type === 'blood_pressure') {
    const systolic = number(value.systolic)
    const diastolic = number(value.diastolic)
    if (!systolic || !diastolic || systolic < 50 || systolic > 260 || diastolic < 30 || diastolic > 160) throw new Error('Enter a valid blood-pressure reading.')
    if (systolic >= 180 || diastolic >= 120) return { ...base, status: 'danger', message: `The recorded reading is ${systolic}/${diastolic} mmHg and is severely elevated.`, suggestion: 'Repeat after five minutes of quiet rest. If it remains this high, seek urgent medical care; call 112 for chest pain, breathing difficulty, weakness, confusion or severe headache.', medicalContext: 'A single reading cannot establish a diagnosis, but very high readings require prompt assessment.' }
    if (systolic >= 130 || diastolic >= 80) return { ...base, status: 'warning', message: `The recorded reading is ${systolic}/${diastolic} mmHg, above the usual adult reference range.`, suggestion: 'Repeat correctly on different days and share the log with a qualified clinician.', medicalContext: 'Diagnosis requires properly taken, repeated measurements and clinical assessment.' }
    return { ...base, status: 'normal', message: `The recorded reading is ${systolic}/${diastolic} mmHg.`, suggestion: 'Keep monitoring at consistent times using a validated cuff.', medicalContext: 'One reading is only a snapshot and should be interpreted with symptoms and health history.' }
  }

  if (type === 'glucose') {
    const glucose = number(value.glucose)
    if (!glucose || glucose < 20 || glucose > 700) throw new Error('Enter a valid glucose reading.')
    if (glucose < 54 || glucose >= 300) return { ...base, status: 'danger', message: `The recorded glucose is ${glucose} mg/dL and may need urgent assessment.`, suggestion: 'Follow your clinician’s sick-day or low-glucose plan if you have one. Seek urgent care for confusion, fainting, vomiting, deep breathing or severe weakness.', medicalContext: 'Interpretation depends on fasting status, time after food, medicines and whether diabetes has been diagnosed.' }
    return { ...base, status: glucose < 70 || glucose >= 140 ? 'warning' : 'normal', message: `The recorded glucose is ${glucose} mg/dL.`, suggestion: 'Record whether this was fasting or how long after a meal, then discuss repeated out-of-range results with a clinician.', medicalContext: 'A standalone value cannot diagnose diabetes because timing and clinical context are essential.' }
  }

  const heartRate = number(value.heart_rate)
  if (!heartRate || heartRate < 20 || heartRate > 260) throw new Error('Enter a valid heart-rate reading.')
  if (heartRate < 40 || heartRate > 140) return { ...base, status: 'danger', message: `The recorded resting heart rate is ${heartRate} bpm.`, suggestion: 'Recheck after resting. Seek urgent care if you also have chest pain, fainting, severe breathlessness or confusion.', medicalContext: 'Fitness, age, fever, stress and medicines can change heart rate; symptoms matter.' }
  return { ...base, status: heartRate < 60 || heartRate > 100 ? 'warning' : 'normal', message: `The recorded resting heart rate is ${heartRate} bpm.`, suggestion: 'Track the trend at rest and discuss persistent changes or symptoms with a clinician.', medicalContext: 'Common adult resting ranges are only a guide and do not replace an examination.' }
}

export type MetricValue = Record<string, string | number>

/** Coerce a submitted reading into the canonical numeric shape stored for each metric. */
export function normalizeReading(type: MetricType, raw: Record<string, unknown>): MetricValue {
  const read = (key: string) => {
    const parsed = typeof raw[key] === 'number' ? raw[key] as number : Number(raw[key])
    return Number.isFinite(parsed) ? parsed : NaN
  }
  if (type === 'blood_pressure') return { systolic: Math.round(read('systolic')), diastolic: Math.round(read('diastolic')) }
  if (type === 'heart_rate') return { heart_rate: Math.round(read('heart_rate')) }
  if (type === 'glucose') {
    const context = typeof raw.context === 'string' && ['fasting', 'after-meal', 'random'].includes(raw.context) ? raw.context : 'random'
    return { glucose: Math.round(read('glucose')), context }
  }
  const weight = read('weight')
  const height = read('height')
  const bmi = Number.isFinite(weight) && Number.isFinite(height) && height > 0 ? weight / Math.pow(height / 100, 2) : read('bmi')
  return { bmi: Number(bmi.toFixed(1)), ...(Number.isFinite(weight) ? { weight } : {}), ...(Number.isFinite(height) ? { height } : {}) }
}

export function formatReading(type: string, value: Record<string, unknown>) {
  if (type === 'blood_pressure') return `${value.systolic ?? '—'}/${value.diastolic ?? '—'}`
  if (type === 'glucose') return String(value.glucose ?? '—')
  if (type === 'heart_rate') return String(value.heart_rate ?? '—')
  if (type === 'bmi') return String(value.bmi ?? '—')
  return '—'
}

export const METRIC_META: Record<MetricType, { label: string; unit: string; short: string }> = {
  blood_pressure: { label: 'Blood pressure', unit: 'mmHg', short: 'BP' },
  glucose: { label: 'Blood glucose', unit: 'mg/dL', short: 'Glucose' },
  heart_rate: { label: 'Resting pulse', unit: 'bpm', short: 'Pulse' },
  bmi: { label: 'Body mass index', unit: 'kg/m²', short: 'BMI' },
}
