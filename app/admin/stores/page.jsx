'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Trash2Icon } from "lucide-react"

export default function AdminStores() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const response = await fetch('/api/stores')
            const data = await response.json()
            setStores(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching stores:', error)
            toast.error('Failed to load stores')
        } finally {
            setLoading(false)
        }
    }

    const toggleIsActive = async (storeId) => {
        try {
            const store = stores.find(s => s.id === storeId)
            const response = await fetch(`/api/stores/${storeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !store.isActive })
            })

            if (!response.ok) throw new Error('Failed to update store')

            await fetchStores()
            toast.success('Store status updated')
        } catch (error) {
            console.error('Error toggling store status:', error)
            toast.error('Failed to update store status')
            throw error
        }
    }

    const deleteStore = async (storeId) => {
        if (!confirm('Are you sure you want to delete this store? This will also delete all associated products.')) {
            return
        }

        try {
            const response = await fetch(`/api/stores/${storeId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete store')

            await fetchStores()
            toast.success('Store deleted successfully')
        } catch (error) {
            console.error('Error deleting store:', error)
            toast.error('Failed to delete store')
            throw error
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Live <span className="text-slate-800 font-medium">Stores</span></h1>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2 flex-wrap">
                                <p>Active</p>
                                <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                    <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleIsActive(store.id), { loading: "Updating data..." })} checked={store.isActive} />
                                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                </label>
                                <button
                                    onClick={() => toast.promise(deleteStore(store.id), { loading: "Deleting store..." })}
                                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded transition"
                                    title="Delete Store"
                                >
                                    <Trash2Icon size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">No stores Available</h1>
                </div>
            )
            }
        </div>
    ) : <Loading />
}