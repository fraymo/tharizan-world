import {createApiClient} from "@fraymo/api-wrapper";
import {store} from "@/redux/store";
import {fetchCart} from "@/redux/cartSlice";
import {fetchWishlist} from "@/redux/wishlistSlice";

const fetchApi = createApiClient({
    apiKey: process.env.NEXT_PUBLIC_API_KEY, baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
})

const seller_email = process.env.NEXT_PUBLIC_SELLER_EMAIL;

const getCustomerEmail = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("customer_email");
    }
    return null;
};
async function sendEmail(emailData) {
    try {
        const result = await fetchApi('/send', {
            headers: {'Content-Type': 'application/json',  'x-user': seller_email},
            method: 'POST', body: emailData, // e.g., { to, subject, text, html }
        });

        console.log('Email sent successfully:', result);
        // Show a success message to the user
    } catch (error) {
        console.error('Failed to send email:', error);

        // The custom ApiError gives you rich context
        if (error.name === 'ApiError') {
            console.error('Status:', error.status); // e.g., 400
            console.error('API Message:', error.data.message); // e.g., "Missing required fields."
            // Show a specific error message to the user based on the response
        }
    }
}


const prepareMailContent = (list) => {
    return list.reduce((acc, item) => {
        acc += `${item}\n`;
        return acc;
    }, '')
};

const prepareHTMLMailContent = (list) => {
    return list.reduce((acc, item) => {
        acc += `<p>${item}</p><br />`;
        return acc;
    }, '')
};

const prepareMailContentMap = (obj) => {
    return Object.keys(obj).map(v => `${v}: ${obj[v]}`).join('');
};

const prepareHTMLMailContentMap = (obj) => {
    return Object.keys(obj).map(v => `<p>${v}: ${obj[v]}</p><br />`).join('');
};

const updateCart = (store) => {
    store.dispatch(fetchCart({
        customer_email: getCustomerEmail(), seller_email
    }));
    store.dispatch(fetchWishlist({
        customer_email: getCustomerEmail(), seller_email
    }));
}

const handleAddToCartEvent = (product, dispatch, addToCart) => {
    try {
        dispatch(addToCart({
            ...product, seller_email, customer_email: getCustomerEmail(), quantity: 1, productId: product._id
        }));
    }
    catch (e) {
        console.error(e);
    }
};

const getCartItem = (cart, product) => cart.find((item) => item.productId === product._id);


const handleQuantityChangeEvent = (product, qty, cart, dispatch, removeFromCart, updateCartQuantity) => {
    const cartItem = getCartItem(cart, product);
    const {
        _id: productId,
        sellingPrice: price,
        category: {name: categoryName},
        subCategory: {name: subCategoryName},
        images: [{Location: image}],
        title: name,
    } = product;
    if (cartItem) {
        const newQuantity = cartItem.quantity + qty;
        if (newQuantity === 0) {
            dispatch(removeFromCart({
                seller_email, customer_email: getCustomerEmail(), productId,
            }));
        } else {
            dispatch(updateCartQuantity({
                seller_email,
                customer_email: getCustomerEmail(),
                productId,
                quantity: newQuantity,
                price,
                category: categoryName,
                subCategory: subCategoryName,
                image,
                name
            }));
        }
    }
};

const handleRemoveFromCartEvent = (product, dispatch, removeFromCart) => {
    dispatch(removeFromCart({
        ...product, seller_email, customer_email: getCustomerEmail(), productId: product._id
    }));
};

const registerFCMToken = async (data) => {
    try{
        const appUrl = process.env.NEXT_PUBLIC_HALALO_CLIENT_PORT;
        const param = `/?f=${encodeURIComponent(JSON.stringify(data))}&seller_email=${encodeURIComponent(seller_email)}&customer_email=${encodeURIComponent(getCustomerEmail())}`;
        const url = `${appUrl}/api/fcm${param}`;
        return await fetch(url, {
            method: 'POST',
            body: {
                f: data,
                seller_email,
                customer_email: getCustomerEmail(),
            }
        });
    }
    catch (e) {
        console.error(e);
    }
    return  {};
};


export {
    sendEmail,
    prepareMailContent,
    prepareHTMLMailContent,
    prepareMailContentMap,
    prepareHTMLMailContentMap,
    fetchApi,
    updateCart,
    seller_email,
    getCustomerEmail,
    handleAddToCartEvent,
    handleQuantityChangeEvent,
    getCartItem,
    handleRemoveFromCartEvent,
    registerFCMToken
}

