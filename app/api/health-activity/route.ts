import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Get recent activity timeline
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '10')

        // Fetch recent health data entries
        const healthData = await prisma.healthData.findMany({
            where: { userEmail: session.user.email },
            orderBy: { createdAt: 'desc' },
            take: limit
        })

        // Format activities with user-friendly messages
        const activities = healthData.map(item => {
            const value = JSON.parse(item.value)
            const createdAt = new Date(item.createdAt)

            let message = ''
            let icon = 'activity'

            switch (item.type) {
                case 'bmi':
                    message = `BMI recorded: ${value.bmi} (${value.category})`
                    icon = 'user'
                    break
                case 'blood_pressure':
                    message = `Blood Pressure logged: ${value.systolic}/${value.diastolic} mmHg`
                    icon = 'heart'
                    break
                case 'glucose':
                    message = `Glucose level tracked: ${value.glucose} mg/dL (${value.type})`
                    icon = 'droplet'
                    break
                case 'heart_rate':
                    message = `Heart rate measured: ${value.heart_rate} BPM`
                    icon = 'activity'
                    break
                case 'weight':
                    message = `Weight updated: ${value.weight} kg`
                    icon = 'scale'
                    break
                case 'exercise':
                    message = `Exercise logged: ${value.type} - ${value.duration} minutes`
                    icon = 'dumbbell'
                    break
                case 'medication':
                    message = `Medication taken: ${value.name}`
                    icon = 'pill'
                    break
                case 'sleep':
                    message = `Sleep tracked: ${value.hours}h ${value.minutes}m - ${value.quality} quality`
                    icon = 'moon'
                    break
                default:
                    message = `Health data recorded`
                    icon = 'activity'
            }

            return {
                id: item.id,
                time: createdAt,
                message,
                icon,
                type: item.type,
                value
            }
        })

        return NextResponse.json(activities)
    } catch (error) {
        console.error('Activity fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
    }
}
