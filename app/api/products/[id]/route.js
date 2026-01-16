import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { id } = params

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
        store: {
          include: {
            user: true,
          },
        },
        rating: {
          include: {
            user: true,
          },
        },
        productTags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, mrp, price, images, categoryId, inStock, tagIds } = body

    // Handle tags update if provided
    if (tagIds !== undefined) {
      // Delete existing tags
      await prisma.productTag.deleteMany({
        where: { productId: id }
      })

      // Add new tags
      if (tagIds.length > 0) {
        await prisma.productTag.createMany({
          data: tagIds.map(tagId => ({
            productId: id,
            tagId
          }))
        })
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(mrp !== undefined && { mrp: parseFloat(mrp) }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(images && { images }),
        ...(categoryId && { categoryId }),
        ...(inStock !== undefined && { inStock }),
      },
      include: {
        category: true,
        store: true,
        productTags: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
