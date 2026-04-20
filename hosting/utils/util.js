import {createApiClient} from "@fraymo/api-wrapper";
import {fetchCart} from "@/redux/cartSlice";
import {fetchWishlist} from "@/redux/wishlistSlice";

const TENANT_STORAGE_KEY = "modern-hub-tenant";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const fetchApi = createApiClient({
    apiKey,
    baseURL: apiBaseUrl
});

const getCustomerEmail = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("customer_email");
    }
    return null;
};

const getStoredTenant = () => {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const value = localStorage.getItem(TENANT_STORAGE_KEY);
        return value ? JSON.parse(value) : null;
    } catch (_error) {
        return null;
    }
};

const setStoredTenant = (tenant) => {
    if (typeof window === "undefined") {
        return;
    }

    if (!tenant) {
        localStorage.removeItem(TENANT_STORAGE_KEY);
        return;
    }

    localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(tenant));
};

const clearConsumerSession = () => {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(TENANT_STORAGE_KEY);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("customer_email");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
};

const fetchStoreConfigBySlugSafe = async (slug = "") => {
    const normalizedSlug = slug?.toString?.().trim?.() || "";

    if (!normalizedSlug) {
        return {ok: false, status: 400, data: null, message: "Store not found."};
    }

    const response = await window.fetch(`${apiBaseUrl}/posts/store-config-by-slug/${encodeURIComponent(normalizedSlug)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": apiKey,
            "x-user": normalizedSlug
        }
    });

    const data = await response.json().catch(() => ({}));
    return {
        ok: response.ok,
        status: response.status,
        data: response.ok ? data : null,
        message: data?.message || "Store not found."
    };
};

const getSellerId = () => getStoredTenant()?.sellerId || "";
const getSellerEmail = () => getStoredTenant()?.sellerEmail || "";
const getTenant = () => getStoredTenant();
const getTenantSlug = () => getStoredTenant()?.slug || "";
const sanitizePathSegment = (value = "") => encodeURIComponent(String(value).trim());
const buildTenantPath = (path = "/", tenant = getStoredTenant()) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const slug = tenant?.slug;

    if (!slug) {
        return normalizedPath;
    }

    if (normalizedPath === "/") {
        return `/${slug}`;
    }

    return `/${slug}${normalizedPath}`;
};

const buildCategoryPath = (categoryName = "", categoryId = "", tenant = getStoredTenant()) => {
    const pathname = buildTenantPath(`/${sanitizePathSegment(categoryName)}`, tenant);
    return categoryId ? `${pathname}?categoryId=${encodeURIComponent(categoryId)}` : pathname;
};

const buildProductPath = (product = {}, tenant = getStoredTenant()) => {
    const categoryName = product?.category?.name || "";
    const subCategoryName = product?.subCategory?.name || "";
    const title = product?.title || "";
    const productId = product?._id || product?.productId || "";
    const pathname = buildTenantPath(`/${sanitizePathSegment(categoryName)}/${sanitizePathSegment(subCategoryName)}/${sanitizePathSegment(title)}`, tenant);
    return productId ? `${pathname}?productId=${encodeURIComponent(productId)}` : pathname;
};

const getTenantHeaders = (overrides = {}, tenant = getStoredTenant()) => {
    const headers = {
        "Content-Type": "application/json",
        ...overrides
    };

    if (tenant?.sellerEmail) {
        headers["x-user"] = tenant.sellerEmail;
    }

    if (tenant?.sellerId) {
        headers["x-seller-id"] = tenant.sellerId;
    }

    return headers;
};

const withTenant = (payload = {}, tenant = getStoredTenant()) => ({
    ...payload,
    ...(tenant?.sellerId ? {seller_id: tenant.sellerId} : {}),
    ...(tenant?.sellerEmail ? {seller_email: tenant.sellerEmail} : {})
});

async function sendEmail(emailData) {
    try {
        return await fetchApi("/send", {
            headers: getTenantHeaders(),
            method: "POST",
            body: emailData,
        });
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}

const prepareMailContent = (list) => list.reduce((acc, item) => `${acc}${item}\n`, "");
const prepareHTMLMailContent = (list) => list.reduce((acc, item) => `${acc}<p>${item}</p><br />`, "");
const prepareMailContentMap = (obj) => Object.keys(obj).map((v) => `${v}: ${obj[v]}`).join("");
const prepareHTMLMailContentMap = (obj) => Object.keys(obj).map((v) => `<p>${v}: ${obj[v]}</p><br />`).join("");

const updateCart = (store, tenant = getStoredTenant()) => {
    if (!tenant?.sellerEmail) {
        return;
    }

    store.dispatch(fetchCart({
        customer_email: getCustomerEmail(),
        seller_id: tenant.sellerId,
        seller_email: tenant.sellerEmail
    }));

    store.dispatch(fetchWishlist({
        customer_email: getCustomerEmail(),
        seller_id: tenant.sellerId,
        seller_email: tenant.sellerEmail
    }));
};

const handleAddToCartEvent = (product, dispatch, addToCart) => {
    const tenant = getStoredTenant();
    if (!tenant?.sellerEmail) {
        return;
    }

    dispatch(addToCart({
        ...product,
        seller_id: tenant.sellerId,
        seller_email: tenant.sellerEmail,
        customer_email: getCustomerEmail(),
        quantity: 1,
        productId: product._id
    }));
};

const getCartItem = (cart, product) => cart.find((item) => item.productId === product._id);

const handleQuantityChangeEvent = (product, qty, cart, dispatch, removeFromCart, updateCartQuantity) => {
    const tenant = getStoredTenant();
    if (!tenant?.sellerEmail) {
        return;
    }

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
                seller_id: tenant.sellerId,
                seller_email: tenant.sellerEmail,
                customer_email: getCustomerEmail(),
                productId,
            }));
        } else {
            dispatch(updateCartQuantity({
                seller_id: tenant.sellerId,
                seller_email: tenant.sellerEmail,
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
    const tenant = getStoredTenant();
    if (!tenant?.sellerEmail) {
        return;
    }

    dispatch(removeFromCart({
        ...product,
        seller_id: tenant.sellerId,
        seller_email: tenant.sellerEmail,
        customer_email: getCustomerEmail(),
        productId: product._id
    }));
};

const registerFCMToken = async (data) => {
    const tenant = getStoredTenant();
    if (!tenant?.sellerEmail) {
        return {};
    }

    try {
        const appUrl = process.env.NEXT_PUBLIC_HALALO_CLIENT_PORT;
        const param = `/?f=${encodeURIComponent(JSON.stringify(data))}&seller_id=${encodeURIComponent(tenant.sellerId)}&seller_email=${encodeURIComponent(tenant.sellerEmail)}&customer_email=${encodeURIComponent(getCustomerEmail())}`;
        const url = `${appUrl}/api/fcm${param}`;
        return await fetch(url, {
            method: "POST",
            body: JSON.stringify(withTenant({
                f: data,
                customer_email: getCustomerEmail(),
            }, tenant)),
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error(error);
    }
    return {};
};

export {
    sendEmail,
    prepareMailContent,
    prepareHTMLMailContent,
    prepareMailContentMap,
    prepareHTMLMailContentMap,
    fetchApi,
    updateCart,
    getCustomerEmail,
    handleAddToCartEvent,
    handleQuantityChangeEvent,
    getCartItem,
    handleRemoveFromCartEvent,
    registerFCMToken,
    TENANT_STORAGE_KEY,
    getStoredTenant,
    setStoredTenant,
    getSellerId,
    getSellerEmail,
    getTenant,
    getTenantSlug,
    getTenantHeaders,
    withTenant,
    buildTenantPath,
    buildCategoryPath,
    buildProductPath,
    clearConsumerSession,
    fetchStoreConfigBySlugSafe
};
