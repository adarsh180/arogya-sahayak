import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { callAI, translateText } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, chatSessionId, type = 'medical', language = 'en' } = await request.json()

    let chatSession
    if (chatSessionId) {
      chatSession = await prisma.chatSession.findUnique({
        where: { id: chatSessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      })
    } else {
      // Create new chat session
      chatSession = await prisma.chatSession.create({
        data: {
          userId: session.user.id,
          title: message.substring(0, 50) + '...',
          type,
          language
        },
        include: { messages: true }
      })
    }

    if (!chatSession) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 })
    }

    // Save user message
    await prisma.message.create({
      data: {
        chatSessionId: chatSession.id,
        role: 'user',
        content: message,
        language
      }
    })

    // Prepare messages for AI
    const aiMessages = chatSession.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }))
    aiMessages.push({ role: 'user', content: message })

    // Get AI response
    const aiResponse = await callAI(aiMessages, type as 'medical' | 'student', language)
    
    if (!aiResponse) {
      return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 })
    }

    // Translate if needed
    let translation = null
    if (language && language !== 'en') {
      translation = await translateText(aiResponse, language)
    }

    // Save AI response
    const assistantMessage = await prisma.message.create({
      data: {
        chatSessionId: chatSession.id,
        role: 'assistant',
        content: aiResponse,
        language,
        translation
      }
    })

    return NextResponse.json({
      message: assistantMessage,
      chatSessionId: chatSession.id
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const chatSessionId = searchParams.get('sessionId')

    if (chatSessionId) {
      const chatSession = await prisma.chatSession.findUnique({
        where: { id: chatSessionId, userId: session.user.id },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      })
      return NextResponse.json(chatSession)
    }

    // Get all chat sessions for user
    const chatSessions = await prisma.chatSession.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } }
    })

    return NextResponse.json(chatSessions)
  } catch (error) {
    console.error('Chat GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}