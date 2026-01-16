import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import { setAddresses } from '@/lib/features/address/addressSlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PayPalButton from './PayPalButton';
import StripeButton from './StripeButton';

const OrderSummary = ({ totalPrice, items }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const router = useRouter();
    const { data: session } = useSession();
    const dispatch = useDispatch();

    const addressList = useSelector(state => state.address.list);

    // Fetch user addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            if (session?.user?.id) {
                try {
                    const response = await fetch(`/api/users/${session.user.id}/addresses`)
                    if (response.ok) {
                        const addresses = await response.json()
                        dispatch(setAddresses(addresses))
                    }
                } catch (error) {
                    console.error('Error fetching addresses:', error)
                }
            }
        }
        
        fetchAddresses()
    }, [session, dispatch])

    const [paymentMethod, setPaymentMethod] = useState('STRIPE');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');

    const handleCouponCode = async (event) => {
        event.preventDefault();
        
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        router.push('/orders')
    }

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-xl p-7 shadow-sm'>
            <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-100'>Payment Summary</h2>
            <p className='text-slate-600 dark:text-slate-300 text-xs my-4'>Payment Method</p>
            <div className='flex gap-2 items-center'>
                <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-slate-700' />
                <label htmlFor="STRIPE" className='cursor-pointer text-slate-700 dark:text-slate-200'>Stripe Payment</label>
            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="PAYPAL" name='payment' onChange={() => setPaymentMethod('PAYPAL')} checked={paymentMethod === 'PAYPAL'} className='accent-slate-700' />
                <label htmlFor="PAYPAL" className='cursor-pointer text-slate-700 dark:text-slate-200'>PayPal</label>
            </div>
            <div className='my-4 py-4 border-y border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'>
                <p className='text-slate-600 dark:text-slate-300 font-medium mb-2'>Address</p>
                {
                    selectedAddress ? (
                        <div className='flex gap-2 items-center'>
                            <p className='text-slate-800 dark:text-slate-100'>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                            <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100' size={18} />
                        </div>
                    ) : (
                        <div>
                            {
                                addressList.length > 0 && (
                                    <select className='border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-2 w-full my-3 outline-none rounded' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                        <option value="">Select Address</option>
                                        {
                                            addressList.map((address, index) => (
                                                <option key={index} value={index}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                            <button className='flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-50 mt-1 font-medium' onClick={() => setShowAddressModal(true)} >Add Address <PlusIcon size={18} /></button>
                        </div>
                    )
                }
            </div>
            <div className='pb-4 border-b border-slate-200 dark:border-slate-700'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-600 dark:text-slate-300'>
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {coupon && <p>Coupon:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right text-slate-800 dark:text-slate-100'>
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <p>Free</p>
                        {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
                    </div>
                </div>
                {
                    !coupon ? (
                        <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })} className='flex justify-center gap-3 mt-3'>
                            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon Code' className='border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-1.5 rounded w-full outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500' />
                            <button className='bg-slate-700 text-white px-3 rounded hover:bg-slate-900 active:scale-95 transition-all'>Apply</button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-center gap-2 text-xs mt-2 text-slate-700 dark:text-slate-200'>
                            <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                            <p>{coupon.description}</p>
                            <XIcon size={18} onClick={() => setCoupon('')} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between py-4 text-slate-800 dark:text-slate-100'>
                <p className='font-semibold'>Total:</p>
                <p className='font-semibold text-right'>{currency}{coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2) : totalPrice.toLocaleString()}</p>
            </div>
            
            {paymentMethod === 'STRIPE' && selectedAddress ? (
                <StripeButton 
                    items={items}
                    totalPrice={totalPrice}
                    selectedAddress={selectedAddress}
                    coupon={coupon}
                />
            ) : paymentMethod === 'PAYPAL' && selectedAddress ? (
                <PayPalButton 
                    items={items}
                    totalPrice={totalPrice}
                    selectedAddress={selectedAddress}
                    coupon={coupon}
                />
            ) : (
                <button 
                    onClick={e => toast.promise(handlePlaceOrder(e), { loading: 'placing Order...' })} 
                    className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={!selectedAddress}
                >
                    {selectedAddress ? 'Place Order' : 'Select Address First'}
                </button>
            )}

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} user={session?.user} />}

        </div>
    )
}

export default OrderSummary