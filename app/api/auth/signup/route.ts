import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { 
      name, email, password, phone, age, gender, userType, preferredLanguage,
      height, weight, bloodGroup, medicalHistory, currentMedications, 
      allergies, chronicConditions, targetExam, currentYear, medicalCollege 
    } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        age: age ? parseInt(age) : null,
        gender,
        userType: userType || 'patient',
        preferredLanguage: preferredLanguage || 'en',
        height,
        weight,
        bloodGroup,
        medicalHistory,
        currentMedications,
        allergies,
        chronicConditions,
        targetExam,
        currentYear,
        medicalCollege
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}