import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        // Fetch all counts and aggregations in parallel
        const [productsCount, ordersData, storesCount, allOrders] = await Promise.all([
            // Total products count
            prisma.product.count(),
            
            // Total orders count and revenue
            prisma.order.aggregate({
                _count: true,
                _sum: {
                    total: true
                }
            }),
            
            // Total stores count
            prisma.store.count(),
            
            // All orders with details for the chart (last 30 days)
            prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    }
                },
                select: {
                    id: true,
                    total: true,
                    status: true,
                    createdAt: true,
                    store: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ])

        const dashboardData = {
            products: productsCount,
            revenue: ordersData._sum.total || 0,
            orders: ordersData._count,
            stores: storesCount,
            allOrders: allOrders.map(order => ({
                id: order.id,
                total: order.total,
                status: order.status,
                storeName: order.store.name,
                date: order.createdAt.toISOString()
            }))
        }

        return NextResponse.json(dashboardData)
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error)
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        )
    }
}
