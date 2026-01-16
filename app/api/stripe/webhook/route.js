import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            // Get user from database
            const user = await prisma.user.findUnique({
                where: { email: session.customer_email },
            });

            if (!user) {
                console.error('User not found:', session.customer_email);
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            // Parse metadata
            const items = JSON.parse(session.metadata.items);
            const addressId = session.metadata.addressId;
            const coupon = session.metadata.coupon ? JSON.parse(session.metadata.coupon) : null;

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
            for (const [storeId, orderItems] of Object.entries(storeOrders)) {
                const storeTotal = orderItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );

                await prisma.order.create({
                    data: {
                        total: storeTotal,
                        userId: user.id,
                        storeId,
                        addressId,
                        isPaid: true,
                        paymentMethod: 'STRIPE',
                        isCouponUsed: coupon ? true : false,
                        coupon: coupon || {},
                        stripeSessionId: session.id,
                        stripePaymentIntent: session.payment_intent,
                        orderItems: {
                            create: orderItems,
                        },
                    },
                });
            }

            // Clear user's cart
            await prisma.user.update({
                where: { id: user.id },
                data: { cart: {} },
            });

            console.log('Order created successfully for session:', session.id);
        } catch (error) {
            console.error('Error processing webhook:', error);
            return NextResponse.json(
                { error: 'Error processing order' },
                { status: 500 }
            );
        }
    }

    return NextResponse.json({ received: true });
}
