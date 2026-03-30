"use client";
import { useEffect, useState } from "react";
import {fetchApi, handleAddToCartEvent, handleQuantityChangeEvent, seller_email} from "@/utils/util";
import {formatCurrency} from "@/utils/formatCurrency";
import {addToCart, removeFromCart, updateCartQuantity} from "@/redux/cartSlice";
import {useDispatch, useSelector} from "react-redux";

export default function SubProducts({ids}) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.items);
    const cartStatus = useSelector(state => state.cart.status);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Example API (replace with your endpoint)
                const {data} = await fetchApi("/posts/getSubProducts",{
                    method: 'POST',
                    body: {
                        ids
                    },
                    headers:{
                        'x-user': seller_email
                    }
                });
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const _handleAddToCart = (product) => {
        console.log("handleAddToCart", JSON.stringify(product));
        handleAddToCartEvent(product, dispatch, addToCart)
    };

    const _handleQuantityChange = (product, qty) => {
        handleQuantityChangeEvent(product, qty, cart, dispatch, removeFromCart, updateCartQuantity)
    };

    if (loading) {
        return (
            <div className="w-full text-center py-10 text-gray-600">Loading products...</div>
        );
    }

    return (
        <div className="mt-6 overflow-x-auto">
            <div className="flex space-x-6">
                {products.map((product) => {
                    const cartItem = cart.find((item) => item.productId === product._id);
                    const isCartLoading = cartStatus === 'loading';
                    return (
                        <div
                            key={product.id}
                            className="min-w-[220px] border-t border-gray-200 pt-4 flex items-center"
                        >
                            <img
                                src={product.images[0].Location}
                                alt={product.title}
                                className="w-20 h-20 rounded-md object-cover"
                            />
                            <div className="ml-4">
                                <p className="font-semibold truncate w-40">{product.title}</p>
                                <p className="text-gray-600">{formatCurrency(product.sellingPrice)}</p>
                                {product.status === "1" ? (cartItem ? (<div
                                    style={{width: "85px"}}
                                    className="flex items-center justify-between bg-[#8C6666] text-white py-2 rounded-md font-semibold">
                                    <button className="px-3"
                                            onClick={() => _handleQuantityChange(product, -1)} disabled={isCartLoading}>-
                                    </button>
                                    <span>{cartItem.quantity}</span>
                                    <button className="px-3"
                                            onClick={() => _handleQuantityChange(product, 1)} disabled={isCartLoading}>+
                                    </button>
                                </div>) : (<button
                                    disabled={isCartLoading}
                                    onClick={()=>_handleAddToCart(product)}
                                    className="text-sm text-[#8B4513] border border-[#8B4513] px-3 py-1 rounded-md mt-1 hover:bg-[#8B4513] hover:text-white transition">
                                    Add
                                </button>)) : (<button
                                    disabled={true}
                                    className="w-full border border-[#8C6666] text-[#A37C7C] py-3 rounded-md font-semibold text-xs hover:bg-[#8C6666] transition"
                                   >
                                    Out of stock
                                </button>)}

                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
