'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setProduct, setLoading, setError } from '@/lib/features/product/productSlice'

export default function ProductsLoader({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(setLoading(true))
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const products = await response.json()
        dispatch(setProduct(products))
      } catch (error) {
        console.error('Error loading products:', error)
        dispatch(setError(error.message))
      }
    }

    fetchProducts()
  }, [dispatch])

  return <>{children}</>
}
