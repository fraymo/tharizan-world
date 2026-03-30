"use client";
import { useEffect, useState } from "react";

export default function SmallProductList() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Example API (replace with your endpoint)
                const res = await fetch("https://fakestoreapi.com/products?limit=6");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="w-full text-center py-10 text-gray-600">Loading products...</div>
        );
    }

    return (
        <div className="mt-6 overflow-x-auto">
            <div className="flex space-x-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="min-w-[220px] border-t border-gray-200 pt-4 flex items-center"
                    >
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-20 h-20 rounded-md object-cover"
                        />
                        <div className="ml-4">
                            <p className="font-semibold truncate w-40">{product.title}</p>
                            <p className="text-gray-600">Rs. {product.price}</p>
                            <button className="text-sm text-[#8B4513] border border-[#8B4513] px-3 py-1 rounded-md mt-1 hover:bg-[#8B4513] hover:text-white transition">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
