import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { type, value } = await request.json()

    let analysis = { status: 'normal', message: '', suggestion: '', dangerLevel: 'low' }

    switch (type) {
      case 'bmi':
        const bmi = parseFloat(value.bmi)
        if (bmi < 18.5) {
          analysis = {
            status: 'warning',
            message: `BMI ${bmi} indicates underweight. Consider consulting a nutritionist.`,
            suggestion: 'Increase caloric intake with healthy foods. Focus on protein-rich meals.',
            dangerLevel: 'medium'
          }
        } else if (bmi >= 18.5 && bmi < 25) {
          analysis = {
            status: 'normal',
            message: `Congratulations! Your BMI ${bmi} is in the normal range.`,
            suggestion: 'Maintain current lifestyle with balanced diet and regular exercise.',
            dangerLevel: 'low'
          }
        } else if (bmi >= 25 && bmi < 30) {
          analysis = {
            status: 'warning',
            message: `BMI ${bmi} indicates overweight. Consider lifestyle changes.`,
            suggestion: 'Reduce caloric intake and increase physical activity. Aim for 150 minutes of exercise weekly.',
            dangerLevel: 'medium'
          }
        } else {
          analysis = {
            status: 'danger',
            message: `BMI ${bmi} indicates obesity. Please consult a healthcare provider.`,
            suggestion: 'Immediate lifestyle intervention needed. Consider professional medical guidance.',
            dangerLevel: 'high'
          }
        }
        break

      case 'blood_pressure':
        const systolic = parseInt(value.systolic)
        const diastolic = parseInt(value.diastolic)
        
        if (systolic < 90 || diastolic < 60) {
          analysis = {
            status: 'warning',
            message: `Blood pressure ${systolic}/${diastolic} is low. Monitor for symptoms.`,
            suggestion: 'Stay hydrated, avoid sudden position changes. Consult doctor if symptomatic.',
            dangerLevel: 'medium'
          }
        } else if (systolic < 120 && diastolic < 80) {
          analysis = {
            status: 'normal',
            message: `Excellent! Your blood pressure ${systolic}/${diastolic} is optimal.`,
            suggestion: 'Continue healthy lifestyle with regular exercise and balanced diet.',
            dangerLevel: 'low'
          }
        } else if (systolic < 140 && diastolic < 90) {
          analysis = {
            status: 'warning',
            message: `Blood pressure ${systolic}/${diastolic} is elevated. Monitor regularly.`,
            suggestion: 'Reduce sodium intake, exercise regularly, manage stress. Check weekly.',
            dangerLevel: 'medium'
          }
        } else {
          analysis = {
            status: 'danger',
            message: `Blood pressure ${systolic}/${diastolic} is high. Seek medical attention.`,
            suggestion: 'Immediate medical consultation required. Monitor daily and follow treatment.',
            dangerLevel: 'high'
          }
        }
        break

      case 'glucose':
        const glucose = parseInt(value)
        if (glucose < 70) {
          analysis = {
            status: 'danger',
            message: `Glucose ${glucose} mg/dL is dangerously low. Take immediate action.`,
            suggestion: 'Consume fast-acting carbs immediately. Seek medical help if severe symptoms.',
            dangerLevel: 'high'
          }
        } else if (glucose >= 70 && glucose < 100) {
          analysis = {
            status: 'normal',
            message: `Great! Your glucose level ${glucose} mg/dL is normal.`,
            suggestion: 'Maintain balanced diet and regular meal timing.',
            dangerLevel: 'low'
          }
        } else if (glucose >= 100 && glucose < 126) {
          analysis = {
            status: 'warning',
            message: `Glucose ${glucose} mg/dL indicates prediabetes. Take preventive action.`,
            suggestion: 'Reduce sugar intake, increase fiber, exercise regularly. Monitor monthly.',
            dangerLevel: 'medium'
          }
        } else {
          analysis = {
            status: 'danger',
            message: `Glucose ${glucose} mg/dL indicates diabetes. Consult doctor immediately.`,
            suggestion: 'Immediate medical consultation required. Follow diabetic diet and medication.',
            dangerLevel: 'high'
          }
        }
        break

      case 'heart_rate':
        const hr = parseInt(value)
        if (hr < 60) {
          analysis = {
            status: 'warning',
            message: `Heart rate ${hr} BPM is low. Monitor for symptoms.`,
            suggestion: 'Normal for athletes. Consult doctor if experiencing dizziness or fatigue.',
            dangerLevel: 'medium'
          }
        } else if (hr >= 60 && hr <= 100) {
          analysis = {
            status: 'normal',
            message: `Perfect! Your heart rate ${hr} BPM is in normal range.`,
            suggestion: 'Continue regular cardiovascular exercise and healthy lifestyle.',
            dangerLevel: 'low'
          }
        } else {
          analysis = {
            status: 'warning',
            message: `Heart rate ${hr} BPM is elevated. Consider causes.`,
            suggestion: 'Check for stress, caffeine, or activity. Rest and recheck. Consult doctor if persistent.',
            dangerLevel: 'medium'
          }
        }
        break
    }

    // Get additional AI insights
    try {
      const aiPrompt = `Provide brief health advice for ${type} value: ${JSON.stringify(value)}. Keep response under 50 words, focus on actionable tips.`
      const aiAdvice = await callAI([{ role: 'user', content: aiPrompt }], 'medical')
      if (aiAdvice && aiAdvice.length > 10) {
        analysis.suggestion += ` AI Tip: ${aiAdvice}`
      }
    } catch (aiError) {
      console.error('AI advice error:', aiError)
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Health analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}