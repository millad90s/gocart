'use client'
import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

export default function ImageUpload({ 
    value = [], 
    onChange, 
    maxFiles = 5,
    folder = 'products' 
}) {
    const [uploading, setUploading] = useState(false)

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files)
        
        if (files.length + value.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} images allowed`)
            return
        }

        setUploading(true)

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('folder', folder)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })

                if (!response.ok) {
                    throw new Error('Upload failed')
                }

                const data = await response.json()
                return data.url
            })

            const urls = await Promise.all(uploadPromises)
            onChange([...value, ...urls])
            toast.success('Images uploaded successfully!')
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload images')
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = async (urlToRemove) => {
        const updatedUrls = value.filter(url => url !== urlToRemove)
        onChange(updatedUrls)
        
        // Optionally delete from Supabase
        try {
            const path = urlToRemove.split('/').slice(-2).join('/')
            await fetch(`/api/upload?path=${encodeURIComponent(path)}`, {
                method: 'DELETE'
            })
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Product Images {value.length > 0 && `(${value.length}/${maxFiles})`}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                        <Image
                            src={url}
                            alt={`Product ${index + 1}`}
                            fill
                            className="object-cover rounded-lg border border-slate-200"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(url)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}

                {value.length < maxFiles && (
                    <label className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition">
                        {uploading ? (
                            <Loader2 className="animate-spin text-slate-400" size={32} />
                        ) : (
                            <>
                                <Upload className="text-slate-400 mb-2" size={32} />
                                <span className="text-sm text-slate-500">Upload Image</span>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            <p className="text-xs text-slate-500 mt-2">
                Upload up to {maxFiles} images. Supported formats: JPG, PNG, WEBP
            </p>
        </div>
    )
}
