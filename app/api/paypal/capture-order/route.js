import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

const PAYPAL_API = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// Generate PayPal access token
async function generateAccessToken() {
    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const data = await response.json();
    return data.access_token;
}

export async function POST(request) {
    try {
        const session = await getServerSession();
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { orderID, items, addressId, total, coupon } = await request.json();

        if (!orderID) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        const accessToken = await generateAccessToken();

        // Capture PayPal payment
        const response = await fetch(
            `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const captureData = await response.json();

        if (!response.ok) {
            console.error('PayPal Capture Error:', captureData);
            return NextResponse.json(
                { error: captureData.message || 'Failed to capture payment' },
                { status: response.status }
            );
        }

        // Check if payment was successful
        if (captureData.status !== 'COMPLETED') {
            return NextResponse.json(
                { error: 'Payment not completed' },
                { status: 400 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Group items by store
        const storeOrders = {};
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.id },
            });

            if (!product) continue;

            if (!storeOrders[product.storeId]) {
                storeOrders[product.storeId] = [];
            }
            storeOrders[product.storeId].push({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
            });
        }

        // Create orders for each store
        const createdOrders = [];
        for (const [storeId, orderItems] of Object.entries(storeOrders)) {
            const storeTotal = orderItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const order = await prisma.order.create({
                data: {
                    total: storeTotal,
                    userId: user.id,
                    storeId,
                    addressId,
                    isPaid: true,
                    paymentMethod: 'PAYPAL',
                    isCouponUsed: coupon ? true : false,
                    coupon: coupon || {},
                    paypalTransactionId: captureData.id,
                    paypalStatus: captureData.status,
                    orderItems: {
                        create: orderItems,
                    },
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            createdOrders.push(order);
        }

        // Clear user's cart
        await prisma.user.update({
            where: { id: user.id },
            data: { cart: {} },
        });

        return NextResponse.json({
            success: true,
            orders: createdOrders,
            transactionId: captureData.id,
        });
    } catch (error) {
        console.error('Error capturing PayPal payment:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
