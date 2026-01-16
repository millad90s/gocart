'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { Trash2Icon, EditIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminManageProducts() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products')
            const data = await response.json()
            setProducts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching products:', error)
            toast.error('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    const toggleStock = async (productId) => {
        try {
            const product = products.find(p => p.id === productId)
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inStock: !product.inStock })
            })

            if (!response.ok) throw new Error('Failed to update product')

            await fetchProducts()
            toast.success('Product stock updated')
        } catch (error) {
            console.error('Error updating product stock:', error)
            toast.error('Failed to update product stock')
            throw error
        }
    }

    const deleteProduct = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return
        }

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Failed to delete product')

            await fetchProducts()
            toast.success('Product deleted successfully')
        } catch (error) {
            console.error('Error deleting product:', error)
            toast.error('Failed to delete product')
            throw error
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl mb-5">Manage <span className="text-slate-800 font-medium">Products</span></h1>
            
            {products.length === 0 ? (
                <div className="flex items-center justify-center h-80">
                    <h2 className="text-3xl text-slate-400 font-medium">No Products Available</h2>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full max-w-6xl text-left ring ring-slate-200 rounded overflow-hidden text-sm">
                        <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3 hidden lg:table-cell">Store</th>
                                <th className="px-4 py-3 hidden md:table-cell">Category</th>
                                <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {products.map((product) => (
                                <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2 items-center">
                                            <Image 
                                                width={40} 
                                                height={40} 
                                                className='p-1 shadow rounded cursor-pointer' 
                                                src={product.images[0]} 
                                                alt="" 
                                            />
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-xs text-slate-500 lg:hidden">{product.store?.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <span className="text-slate-600">{product.store?.name}</span>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                                            {product.category?.name || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">{currency} {product.mrp.toLocaleString()}</td>
                                    <td className="px-4 py-3 font-semibold">{currency} {product.price.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                onChange={() => toast.promise(toggleStock(product.id), { loading: "Updating..." })} 
                                                checked={product.inStock} 
                                            />
                                            <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                        </label>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => router.push(`/admin/edit-product/${product.id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                                title="Edit Product"
                                            >
                                                <EditIcon size={16} />
                                            </button>
                                            <button
                                                onClick={() => toast.promise(deleteProduct(product.id), { loading: "Deleting..." })}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                                title="Delete Product"
                                            >
                                                <Trash2Icon size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
