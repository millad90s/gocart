'use client'
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { assets } from "@/assets/assets"
import { EditIcon, Trash2Icon, PlusCircleIcon } from "lucide-react"

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [addresses, setAddresses] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        image: null
    })

    const [addressInfo, setAddressInfo] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    })

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/')
            return
        }
        if (status === "authenticated" && session?.user?.id) {
            fetchUserData()
        }
    }, [status, session])

    const fetchUserData = async () => {
        if (!session?.user?.id) return
        
        try {
            const userId = session.user.id
            const [userRes, addressesRes] = await Promise.all([
                fetch(`/api/users/${userId}`),
                fetch(`/api/users/${userId}/addresses`)
            ])

            const [userData, addressesData] = await Promise.all([
                userRes.json(),
                addressesRes.json()
            ])

            if (userData && !userData.error) {
                setUser(userData)
                setUserInfo({
                    name: userData.name,
                    email: userData.email,
                    image: null
                })
            }

            setAddresses(Array.isArray(addressesData) ? addressesData : [])
        } catch (error) {
            console.error('Error fetching user data:', error)
            toast.error('Failed to load profile')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()

        if (!session?.user?.id) return

        try {
            const userId = session.user.id
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userInfo)
            })

            if (!response.ok) throw new Error('Failed to update profile')

            await fetchUserData()
            setEditMode(false)
            toast.success('Profile updated successfully!')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
            throw error
        }
    }

    const handleAddressSubmit = async (e) => {
        e.preventDefault()

        if (!session?.user?.id) return

        try {
            const userId = session.user.id
            if (editingAddress) {
                // Update existing address
                const response = await fetch(`/api/addresses/${editingAddress}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(addressInfo)
                })

                if (!response.ok) throw new Error('Failed to update address')
                toast.success('Address updated successfully!')
            } else {
                // Create new address
                const response = await fetch(`/api/users/${userId}/addresses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(addressInfo)
                })

                if (!response.ok) throw new Error('Failed to add address')
                toast.success('Address added successfully!')
            }

            await fetchUserData()
            setShowAddressForm(false)
            setEditingAddress(null)
            setAddressInfo({
                name: "",
                email: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                country: ""
            })
        } catch (error) {
            console.error('Error saving address:', error)
            toast.error('Failed to save address')
            throw error
        }
    }

    const handleEditAddress = (address) => {
        setAddressInfo({
            name: address.name,
            email: address.email,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country
        })
        setEditingAddress(address.id)
        setShowAddressForm(true)
    }

    const handleDeleteAddress = async (addressId) => {
        if (!confirm('Are you sure you want to delete this address?')) return

        try {
            const response = await fetch(`/api/addresses/${addressId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete address')

            await fetchUserData()
            toast.success('Address deleted successfully!')
        } catch (error) {
            console.error('Error deleting address:', error)
            toast.error('Failed to delete address')
            throw error
        }
    }

    if (status === "loading" || loading) return <Loading />

    if (!session) {
        return null
    }

    return (
        <div className="min-h-screen mx-6 my-16">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-medium text-slate-800 mb-8">My Profile</h1>

                {/* Profile Section */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <h2 className="text-xl font-medium text-slate-800">Personal Information</h2>
                        {!editMode && (
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >
                                <EditIcon size={18} />
                                Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={editMode ? (e) => toast.promise(handleUpdateProfile(e), { loading: "Updating..." }) : (e) => e.preventDefault()}>
                        <div className="flex gap-6 items-start">
                            <div className="flex-shrink-0">
                                <Image
                                    src={user?.image || assets.gs_logo}
                                    alt="Profile"
                                    width={100}
                                    height={100}
                                    className="rounded-full border-2 border-slate-200"
                                />
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={userInfo.name}
                                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                        disabled={!editMode}
                                        className="w-full p-2 border border-slate-200 rounded outline-slate-400 disabled:bg-slate-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={userInfo.email}
                                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                        disabled={!editMode}
                                        className="w-full p-2 border border-slate-200 rounded outline-slate-400 disabled:bg-slate-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {editMode && (
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-900 transition"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditMode(false)
                                        setUserInfo({
                                            name: user.name,
                                            email: user.email,
                                            image: null
                                        })
                                    }}
                                    className="bg-slate-200 text-slate-800 px-6 py-2 rounded hover:bg-slate-300 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Addresses Section */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-6">
                        <h2 className="text-xl font-medium text-slate-800">Saved Addresses</h2>
                        <button
                            onClick={() => {
                                setShowAddressForm(true)
                                setEditingAddress(null)
                                setAddressInfo({
                                    name: "",
                                    email: "",
                                    phone: "",
                                    street: "",
                                    city: "",
                                    state: "",
                                    zip: "",
                                    country: ""
                                })
                            }}
                            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-900 transition"
                        >
                            <PlusCircleIcon size={18} />
                            Add Address
                        </button>
                    </div>

                    {/* Address Form */}
                    {showAddressForm && (
                        <form onSubmit={(e) => toast.promise(handleAddressSubmit(e), { loading: "Saving..." })} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h3 className="text-lg font-medium text-slate-800 mb-4">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={addressInfo.name}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, name: e.target.value })}
                                    className="p-2 border border-slate-200 rounded outline-slate-400"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={addressInfo.email}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, email: e.target.value })}
                                    className="p-2 border border-slate-200 rounded outline-slate-400"
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={addressInfo.phone}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, phone: e.target.value })}
                                    className="p-2 border border-slate-200 rounded outline-slate-400"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={addressInfo.street}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, street: e.target.value })}
                                    className="p-2 border border-slate-200 rounded outline-slate-400"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={addressInfo.city}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value })}
                                    className="p-2 border border-slate-200 rounded outline-slate-400"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="State/Province"
                                    value={addressInfo.state}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, state: e.target.value })}
                                    className="p-2 border border-slate-200 rounded outline-slate-400"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="ZIP/Postal Code"
                                    value={addressInfo.zip}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, zip: e.target.value })}
                                    className="p-2 border border-slate-200 rounded outline-slate-400"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Country"
                                    value={addressInfo.country}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, country: e.target.value })}
                                    className="p-2 border border-slate-200 rounded outline-slate-400"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="submit"
                                    className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-900 transition"
                                >
                                    {editingAddress ? 'Update Address' : 'Add Address'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddressForm(false)
                                        setEditingAddress(null)
                                    }}
                                    className="bg-slate-200 text-slate-800 px-6 py-2 rounded hover:bg-slate-300 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Address List */}
                    {addresses.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No saved addresses yet</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((address) => (
                                <div key={address.id} className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-slate-800">{address.name}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditAddress(address)}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <EditIcon size={16} />
                                            </button>
                                            <button
                                                onClick={() => toast.promise(handleDeleteAddress(address.id), { loading: "Deleting..." })}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2Icon size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600">{address.street}</p>
                                    <p className="text-sm text-slate-600">{address.city}, {address.state} {address.zip}</p>
                                    <p className="text-sm text-slate-600">{address.country}</p>
                                    <p className="text-sm text-slate-600 mt-2">Phone: {address.phone}</p>
                                    <p className="text-sm text-slate-600">Email: {address.email}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
