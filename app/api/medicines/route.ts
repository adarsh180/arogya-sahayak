import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { callAI } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, dosage, frequency, startDate, endDate, reminders, notes } = await request.json()

    // Get AI analysis of the medicine
    const aiPrompt = `You are a medical expert. Analyze this medication with accurate medical knowledge:

Medicine: ${name}
Dosage: ${dosage}
Frequency: ${frequency}

IMPORTANT: Provide accurate information based on actual medical knowledge. For example:
- NEXPRO/Nexium (Esomeprazole) = Proton pump inhibitor for acid reflux, GERD, stomach ulcers
- Metformin = Diabetes medication for blood sugar control
- Aspirin = Pain reliever, anti-inflammatory, blood thinner
- Paracetamol = Pain reliever and fever reducer
- Omeprazole = Acid reducer for stomach problems
- Atorvastatin = Cholesterol-lowering medication

Provide analysis in this exact JSON format:
{
  "category": "exact drug class (e.g., Proton Pump Inhibitor, Antidiabetic, NSAID)",
  "purpose": "primary medical use and conditions treated",
  "sideEffects": ["list 3-4 most common side effects"],
  "precautions": ["important safety precautions and contraindications"],
  "interactions": ["major drug interactions to avoid"],
  "bestTime": "optimal timing (morning/evening/with meals)",
  "withFood": "take with food/empty stomach/doesn't matter",
  "warnings": ["serious warnings and when to contact doctor"]
}

Be medically accurate and specific to the actual medication.`

    let aiAnalysis = null
    try {
      const aiResponse = await callAI([{ role: 'user', content: aiPrompt }], 'medical')
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('AI analysis error:', error)
    }

    const medicine = await prisma.medication.create({
      data: {
        userId: session.user.id,
        name,
        dosage,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        reminders: reminders || [],
        notes: notes || '',
        isActive: true,
        aiAnalysis: aiAnalysis ? JSON.stringify(aiAnalysis) : null
      }
    })

    return NextResponse.json(medicine)
  } catch (error) {
    console.error('Medicine creation error:', error)
    return NextResponse.json({ error: 'Failed to create medicine' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const medicines = await prisma.medication.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    const formattedMedicines = medicines.map(med => ({
      ...med,
      aiAnalysis: med.aiAnalysis ? JSON.parse(med.aiAnalysis) : null
    }))

    return NextResponse.json(formattedMedicines)
  } catch (error) {
    console.error('Medicine fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch medicines' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...updateData } = await request.json()

    const medicine = await prisma.medication.update({
      where: { id, userId: session.user.id },
      data: updateData
    })

    return NextResponse.json(medicine)
  } catch (error) {
    console.error('Medicine update error:', error)
    return NextResponse.json({ error: 'Failed to update medicine' }, { status: 500 })
  }
}