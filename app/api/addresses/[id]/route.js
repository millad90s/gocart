import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    
    const address = await prisma.address.findUnique({
      where: { id }
    })

    if (!address) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(address)
  } catch (error) {
    console.error('Error fetching address:', error)
    return NextResponse.json(
      { error: 'Failed to fetch address' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, street, city, state, zip, country, phone } = body

    const address = await prisma.address.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(street && { street }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zip && { zip }),
        ...(country && { country }),
        ...(phone && { phone }),
      }
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    await prisma.address.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
