import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchApi} from "@/utils/util";

const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Async thunk for fetching the cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async ({customer_email, seller_email}) => {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("cart")) || []
    } catch (e) {

    }
    if (customer_email) {
        cart = await fetchApi(`/cart/${customer_email}/${seller_email}`, {
            headers: {
                'x-user': seller_email
            }
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
});

export const updateCartFromLocalStorage = createAsyncThunk('cart/updateCartFromLocalStorage', async (cart) => {
    return cart;
});

// Async thunk for adding an item to the cart
export const addToCart = createAsyncThunk('cart/addToCart', async (product) => {
    const {
        _id,
        quantity,
        seller_email,
        customer_email,
        sellingPrice: price,
        category: {name: categoryName},
        subCategory: {name: subCategoryName},
        images: [{Location: image}],
        title: name
    } = product;
    console.log('[addToCart]');
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("cart")) || []
    } catch (e) {

    }
    if (customer_email) {
        const res = await fetchApi('/cart/add', {
            headers: {
                'x-user': seller_email
            }, method: 'POST', body: {
                seller_email,
                customer_email,
                productId: _id,
                quantity,
                price,
                image,
                category: categoryName,
                subCategory: subCategoryName,
                name
            },
        });
        cart = res.cart;
    } else {
        cart.push({
            seller_email,
            customer_email,
            productId: _id,
            quantity,
            price,
            image,
            category: categoryName,
            subCategory: subCategoryName,
            name
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
});

// Async thunk for updating item quantity
export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', async ({
                                                                                         seller_email,
                                                                                         customer_email,
                                                                                         productId,
                                                                                         quantity,
                                                                                         price,
                                                                                         category,
                                                                                         subCategory,
                                                                                         image,
                                                                                         name,
                                                                                     }) => {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("cart")) || []
    } catch (e) {

    }
    if (customer_email) {
        const res = await fetchApi(`/cart/update`, {
            headers: {
                'x-user': seller_email
            }, method: 'PUT', body: {
                seller_email, customer_email, productId, quantity, price, category, subCategory, image, name
            },
        });
        localStorage.setItem("cart", JSON.stringify(res.cart));
        cart = res.cart;
    } else {
        const index = cart.findIndex((item) => item.productId === productId);
        cart[index].quantity = quantity;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
});


// Async thunk for removing an item from the cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({
                                                                                 seller_email, customer_email, productId
                                                                             }) => {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem("cart")) || []
    } catch (e) {

    }
    if (customer_email) {
        cart = await fetchApi(`/cart/remove`, {
            headers: {
                'x-user': seller_email
            }, method: 'DELETE', body: {
                seller_email, customer_email, productId
            }
        });
    } else {
        const index = cart.findIndex((item) => item.productId === productId);
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart; // Return the ID of the removed product
});

export const resetCart = createAsyncThunk("cart/reset", async ({}) => {
    localStorage.removeItem("cart");
    return [];
});

const cartSlice = createSlice({
    name: 'cart', initialState, reducers: {}, extraReducers: (builder) => {
        builder
            // Generic cases for pending and rejected
            // Fulfilled cases
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // API returns the updated cart
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // API returns the updated cart
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(updateCartFromLocalStorage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(resetCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addMatcher((action) => (action.type.indexOf('cart')>0 && action.type.endsWith('/pending')), (state,action) => {
                state.status = 'loading';
            })
            .addMatcher((action) => (action.type.indexOf('cart')>0 && action.type.endsWith('/rejected')), (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default cartSlice.reducer;
