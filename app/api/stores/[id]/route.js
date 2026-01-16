import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        Product: true,
        _count: {
          select: {
            Product: true,
            Order: true,
          }
        }
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error('Error fetching store:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, username, address, email, contact, logo, status, isActive } = body

    const store = await prisma.store.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(username && { username }),
        ...(address && { address }),
        ...(email && { email }),
        ...(contact && { contact }),
        ...(logo && { logo }),
        ...(status && { status }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.error('Error updating store:', error)
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    await prisma.store.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Store deleted successfully' })
  } catch (error) {
    console.error('Error deleting store:', error)
    return NextResponse.json(
      { error: 'Failed to delete store' },
      { status: 500 }
    )
  }
}
