'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useRouter, useParams } from "next/navigation"
import Loading from "@/components/Loading"

export default function StoreEditProduct() {
    const router = useRouter()
    const params = useParams()
    const productId = params.productId

    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        categoryId: "",
    })
    const [selectedTags, setSelectedTags] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [existingImages, setExistingImages] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, tagsRes, productRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/tags'),
                    fetch(`/api/products/${productId}`)
                ])
                
                const [categoriesData, tagsData, productData] = await Promise.all([
                    categoriesRes.json(),
                    tagsRes.json(),
                    productRes.json()
                ])
                
                setCategories(Array.isArray(categoriesData) ? categoriesData : [])
                setTags(Array.isArray(tagsData) ? tagsData : [])
                
                if (productData && !productData.error) {
                    setProductInfo({
                        name: productData.name,
                        description: productData.description,
                        mrp: productData.mrp,
                        price: productData.price,
                        categoryId: productData.categoryId,
                    })
                    setExistingImages(productData.images || [])
                    setSelectedTags(productData.productTags?.map(pt => pt.tagId) || [])
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                toast.error('Failed to load product data')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [productId])

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const toggleTag = (tagId) => {
        setSelectedTags(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        )
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            // Use existing images if no new images uploaded
            const newImageUrls = Object.values(images)
                .filter(img => img !== null)
                .map((img, index) => {
                    return `https://images.unsplash.com/photo-placeholder-${Date.now()}-${index}?w=800`
                })

            const finalImages = newImageUrls.length > 0 ? newImageUrls : existingImages

            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...productInfo,
                    images: finalImages,
                    tagIds: selectedTags,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to update product')
            }

            toast.success('Product updated successfully!')
            router.push('/store/manage-product')
        } catch (error) {
            console.error('Error updating product:', error)
            toast.error('Failed to update product')
            throw error
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <Loading />

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Updating Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Edit <span className="text-slate-800 font-medium">Product</span></h1>
            
            <p className="mt-7">Product Images</p>
            <div className="flex gap-3 mt-4">
                {Object.keys(images).map((key, index) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image 
                            width={300} 
                            height={300} 
                            className='h-15 w-auto border border-slate-200 rounded cursor-pointer' 
                            src={images[key] ? URL.createObjectURL(images[key]) : (existingImages[index] || assets.upload_area)} 
                            alt="" 
                        />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Product Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Actual Price ($)
                    <input type="number" step="0.01" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0.00" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Offer Price ($)
                    <input type="number" step="0.01" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0.00" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
            </div>

            <select 
                onChange={e => setProductInfo({ ...productInfo, categoryId: e.target.value })} 
                value={productInfo.categoryId} 
                className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" 
                required
            >
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>

            {tags.length > 0 && (
                <div className="my-6">
                    <p className="mb-3">Tags (Optional)</p>
                    <div className="flex flex-wrap gap-2 max-w-sm">
                        {tags.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => toggleTag(tag.id)}
                                className={`px-4 py-1.5 rounded-full text-sm transition ${
                                    selectedTags.includes(tag.id)
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <button 
                    disabled={submitting} 
                    className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition disabled:opacity-50"
                >
                    Update Product
                </button>
                <button 
                    type="button"
                    onClick={() => router.push('/store/manage-product')}
                    className="bg-slate-200 text-slate-800 px-6 mt-7 py-2 hover:bg-slate-300 rounded transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
