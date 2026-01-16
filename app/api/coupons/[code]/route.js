import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { code } = await params
    
    const coupon = await prisma.coupon.findUnique({
      where: { code }
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(coupon)
  } catch (error) {
    console.error('Error fetching coupon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coupon' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { code } = await params
    const body = await request.json()
    const { description, discount, forNewUser, forMember, isPublic, expiresAt } = body

    const coupon = await prisma.coupon.update({
      where: { code },
      data: {
        ...(description && { description }),
        ...(discount !== undefined && { discount: parseFloat(discount) }),
        ...(forNewUser !== undefined && { forNewUser }),
        ...(forMember !== undefined && { forMember }),
        ...(isPublic !== undefined && { isPublic }),
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
      }
    })

    return NextResponse.json(coupon)
  } catch (error) {
    console.error('Error updating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { code } = await params

    await prisma.coupon.delete({
      where: { code }
    })

    return NextResponse.json({ message: 'Coupon deleted successfully' })
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    )
  }
}
