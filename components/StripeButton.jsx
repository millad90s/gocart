'use client';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripeButton = ({ items, totalPrice, selectedAddress, coupon }) => {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!selectedAddress) {
            toast.error('Please select an address');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        images: item.images,
                        description: item.description,
                    })),
                    total: coupon 
                        ? totalPrice - (coupon.discount / 100 * totalPrice)
                        : totalPrice,
                    addressId: selectedAddress.id,
                    coupon: coupon || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Redirect to Stripe Checkout
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({
                sessionId: data.sessionId,
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to start checkout');
            setLoading(false);
        }
    };

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        return (
            <div className="text-red-500 text-sm mt-4">
                Stripe is not configured. Please add your Stripe Publishable Key.
            </div>
        );
    }

    return (
        <button
            onClick={handleCheckout}
            disabled={loading || !selectedAddress}
            className='w-full bg-indigo-600 text-white py-2.5 rounded hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        >
            {loading ? 'Processing...' : selectedAddress ? 'Pay with Stripe' : 'Select Address First'}
        </button>
    );
};

export default StripeButton;
