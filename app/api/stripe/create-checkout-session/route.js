import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const session = await getServerSession();
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { items, total, addressId, coupon } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items in cart' },
                { status: 400 }
            );
        }

        if (!addressId) {
            return NextResponse.json(
                { error: 'Address is required' },
                { status: 400 }
            );
        }

        const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: item.images && item.images.length > 0 ? [item.images[0]] : [],
                        description: item.description || '',
                    },
                    unit_amount: Math.round(item.price * 100), // Convert to cents
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.NEXTAUTH_URL}/orders?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
            customer_email: session.user.email,
            metadata: {
                userId: session.user.id || session.user.email,
                addressId: addressId,
                coupon: coupon ? JSON.stringify(coupon) : '',
                items: JSON.stringify(items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                }))),
            },
        });

        return NextResponse.json({ 
            sessionId: checkoutSession.id,
            url: checkoutSession.url 
        });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
