'use client';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const PayPalButton = ({ items, totalPrice, selectedAddress, coupon, onSuccess }) => {
    const router = useRouter();

    const createOrder = async () => {
        try {
            const response = await fetch('/api/paypal/create-order', {
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
                    })),
                    total: coupon 
                        ? totalPrice - (coupon.discount / 100 * totalPrice)
                        : totalPrice,
                }),
            });

            const order = await response.json();

            if (!response.ok) {
                throw new Error(order.error || 'Failed to create order');
            }

            return order.id;
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error(error.message || 'Failed to create PayPal order');
            throw error;
        }
    };

    const onApprove = async (data) => {
        try {
            const response = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderID: data.orderID,
                    items: items.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    addressId: selectedAddress.id,
                    total: coupon 
                        ? totalPrice - (coupon.discount / 100 * totalPrice)
                        : totalPrice,
                    coupon: coupon || null,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to capture payment');
            }

            toast.success('Payment successful! Order placed.');
            
            if (onSuccess) {
                onSuccess(result);
            }
            
            router.push('/orders');
        } catch (error) {
            console.error('Error capturing payment:', error);
            toast.error(error.message || 'Failed to process payment');
        }
    };

    const onError = (error) => {
        console.error('PayPal error:', error);
        toast.error('An error occurred with PayPal. Please try again.');
    };

    return (
        <div className="mt-4">
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                style={{
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal',
                }}
            />
        </div>
    );
};

export default function PayPalButtonWrapper(props) {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId) {
        return (
            <div className="text-red-500 text-sm mt-4">
                PayPal is not configured. Please add your PayPal Client ID.
            </div>
        );
    }

    return (
        <PayPalScriptProvider
            options={{
                clientId: clientId,
                currency: 'USD',
                intent: 'capture',
            }}
        >
            <PayPalButton {...props} />
        </PayPalScriptProvider>
    );
}
