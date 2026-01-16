import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        _count: {
          select: {
            Product: true,
            Order: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(stores)
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, name, description, username, address, email, contact, logo } = body

    // Validate required fields
    if (!userId || !name || !username || !email || !contact || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already has a store
    const existingStore = await prisma.store.findUnique({
      where: { userId }
    })

    if (existingStore) {
      return NextResponse.json(
        { error: 'User already has a store' },
        { status: 400 }
      )
    }

    // Check if username is taken
    const usernameExists = await prisma.store.findUnique({
      where: { username }
    })

    if (usernameExists) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    const store = await prisma.store.create({
      data: {
        userId,
        name,
        description: description || '',
        username,
        address,
        email,
        contact,
        logo: logo || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + username,
        status: 'pending',
        isActive: false,
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(store, { status: 201 })
  } catch (error) {
    console.error('Error creating store:', error)
    return NextResponse.json(
      { error: 'Failed to create store' },
      { status: 500 }
    )
  }
}
