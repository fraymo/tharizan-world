import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchApi} from "@/utils/util";

const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Async thunk for fetching the wishlist
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async ({customer_email, seller_email}) => {
    let wishlist = [];
    console.log('[fetchWishlist]')
    try {
        wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
    } catch (e) {

    }
    if (customer_email) {
        wishlist = await fetchApi(`/cart/getWishlist`,{
            headers: {
                'x-user': seller_email
            },
            method: 'POST',
            body: {
                customer_email,
                seller_email,
            }
        });
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    return wishlist;
});

export const updateWishlistFromLocalStorage = createAsyncThunk('wishlist/updateWishlistFromLocalStorage', async (wishlist) => {
    console.log('[updateWishlistFromLocalStorage]')
    return wishlist;
});

// Async thunk for adding an item to the wishlist
export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (product) => {
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
    console.log('[addToWishlist]')
    let wishlist = [];
    try {
        wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
    } catch (e) {

    }
    if (customer_email) {
        const res = await fetchApi('/cart/addWishlist', {
            headers: {
                'x-user': seller_email
            },
            method: 'POST', body: {
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
        wishlist = res.wishlist;
    } else {
        wishlist.push({
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
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    return wishlist;
});

// Async thunk for updating item quantity
export const updateWishlistQuantity = createAsyncThunk('wishlist/updateWishlistQuantity', async ({
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
    console.log('[updateWishlistQuantity]')
    let wishlist = [];
    try {
        wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
    } catch (e) {

    }
    if (customer_email) {
        const res = await fetchApi(`/wishlist/update`, {
            headers: {
                'x-user': seller_email
            },
            method: 'PUT', body: {
                seller_email, customer_email, productId, quantity, price, category, subCategory, image, name
            },
        });
        localStorage.setItem("wishlist", JSON.stringify(res.wishlist));
        wishlist = res.wishlist;
    } else {
        const index = wishlist.findIndex((item) => item.productId === productId);
        wishlist[index].quantity = quantity;
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    return wishlist;
});


// Async thunk for removing an item from the wishlist
export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async ({
                                                                                 seller_email, customer_email, productId
                                                                             }) => {
    console.log('[removeFromWishlist]')
    let wishlist = [];
    try {
        wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
    } catch (e) {

    }
    if (customer_email) {
        const res = await fetchApi(`/cart/removeWishlistByProduct`, {
            headers: {
                'x-user': seller_email
            },
            method: 'DELETE', body: {
                seller_email, customer_email, productId
            }
        });
        if(res.success){
            wishlist = res.wishlist;
        }
    } else {
        const index = wishlist.findIndex((item) => item.productId === productId);
        wishlist.splice(index, 1);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    return wishlist; // Return the ID of the removed product
});

export const resetWishlist = createAsyncThunk("wishlist/reset", async ({}) => {
    console.log('[resetWishlist]')
    localStorage.removeItem("wishlist");
    return [];
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // API returns the updated wishlist
            })
            .addCase(updateWishlistQuantity.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // API returns the updated wishlist
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(updateWishlistFromLocalStorage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(resetWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addMatcher((action) => (action.type.indexOf('wish')>0 && action.type.endsWith('/pending')), (state,action) => {
                state.status = 'loading';
            })
            .addMatcher((action) => (action.type.indexOf('wish')>0 && action.type.endsWith('/rejected')), (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default wishlistSlice.reducer;
