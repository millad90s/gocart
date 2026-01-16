import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, description, mrp, price, images, categoryId, storeId, tagIds } = body

    // Validate required fields
    if (!name || !description || !mrp || !price || !categoryId || !storeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create product with tags if provided
    const product = await prisma.product.create({
      data: {
        name,
        description,
        mrp: parseFloat(mrp),
        price: parseFloat(price),
        images: images || [],
        categoryId,
        storeId,
        productTags: tagIds?.length ? {
          create: tagIds.map(tagId => ({
            tagId
          }))
        } : undefined
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

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
