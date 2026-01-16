import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        // Get the current user's session
        const session = await getServerSession()
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const userId = session.user.id

        // Get the store for this user
        const store = await prisma.store.findUnique({
            where: { userId }
        })

        if (!store) {
            return NextResponse.json(
                { error: 'Store not found' },
                { status: 404 }
            )
        }

        // Fetch store-specific data in parallel
        const [productsCount, ordersData, ratings] = await Promise.all([
            // Total products count for this store
            prisma.product.count({
                where: { storeId: store.id }
            }),
            
            // Total orders count and earnings for this store
            prisma.order.aggregate({
                where: { storeId: store.id },
                _count: true,
                _sum: {
                    total: true
                }
            }),
            
            // Ratings for this store's products with user and product details
            prisma.rating.findMany({
                where: {
                    product: {
                        storeId: store.id
                    }
                },
                select: {
                    id: true,
                    rating: true,
                    review: true,
                    createdAt: true,
                    user: {
                        select: {
                            name: true,
                            image: true
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            category: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ])

        const dashboardData = {
            totalProducts: productsCount,
            totalEarnings: ordersData._sum.total || 0,
            totalOrders: ordersData._count,
            ratings: ratings.map(rating => ({
                id: rating.id,
                rating: rating.rating,
                review: rating.review,
                createdAt: rating.createdAt.toISOString(),
                user: {
                    name: rating.user.name || 'Anonymous',
                    image: rating.user.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                },
                product: {
                    id: rating.product.id,
                    name: rating.product.name,
                    category: {
                        name: rating.product.category?.name || 'Uncategorized'
                    }
                }
            }))
        }

        return NextResponse.json(dashboardData)
    } catch (error) {
        console.error('Error fetching store dashboard data:', error)
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        )
    }
}
