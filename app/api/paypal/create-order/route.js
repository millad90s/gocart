import { NextResponse } from 'next/server';

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
        const { items, total } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items in cart' },
                { status: 400 }
            );
        }

        const accessToken = await generateAccessToken();

        // Create PayPal order
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: total.toFixed(2),
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value: total.toFixed(2),
                                },
                            },
                        },
                        items: items.map((item) => ({
                            name: item.name,
                            unit_amount: {
                                currency_code: 'USD',
                                value: item.price.toFixed(2),
                            },
                            quantity: item.quantity.toString(),
                        })),
                    },
                ],
                application_context: {
                    brand_name: 'GoCart',
                    landing_page: 'NO_PREFERENCE',
                    user_action: 'PAY_NOW',
                    return_url: `${process.env.NEXTAUTH_URL}/orders`,
                    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
                },
            }),
        });

        const order = await response.json();

        if (!response.ok) {
            console.error('PayPal API Error:', order);
            return NextResponse.json(
                { error: order.message || 'Failed to create PayPal order' },
                { status: response.status }
            );
        }

        return NextResponse.json({ id: order.id });
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
