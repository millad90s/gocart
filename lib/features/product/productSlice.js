import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
            state.loading = false
            state.error = null
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        clearProduct: (state) => {
            state.list = []
            state.loading = false
            state.error = null
        }
    }
})

export const { setProduct, setLoading, setError, clearProduct } = productSlice.actions

export default productSlice.reducer