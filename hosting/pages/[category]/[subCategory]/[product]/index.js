import React, {useEffect, useState} from 'react';
import Item from "@/components/item";
import {useRouter} from 'next/router';
import FlashSale from "@/components/flashsales";
import {fetchApi, seller_email} from "@/utils/util";

const Index = () => {
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!router.isReady) return;

        const loadProduct = async () => {
            try {
                const storedProduct = JSON.parse(localStorage.getItem('selected-product'));
                if (storedProduct) {
                    setProduct(storedProduct);
                }

                const { productId } = router.query;
                const categoryId = storedProduct?.category?._id;
                const subCategoryId = storedProduct?.subCategory?._id;

                if (!productId || !categoryId) {
                    return;
                }

                const query = subCategoryId
                    ? `/posts/new-arrivals?category=${categoryId}&subCategory=${subCategoryId}&page=1&limit=100`
                    : `/posts/new-arrivals?category=${categoryId}&page=1&limit=100`;

                const data = await fetchApi(query, {
                    method: "GET",
                    headers: {
                        "x-user": seller_email,
                    },
                });

                const matchedProduct = data?.data?.find((item) => item._id === productId);
                if (matchedProduct) {
                    setProduct(matchedProduct);
                    localStorage.setItem("selected-product", JSON.stringify(matchedProduct));
                }
            } catch (error) {
                console.error("Failed to load full product details", error);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [router.isReady, router.query]);

    if (loading && !product) {
        return <div>Loading product...</div>;
    }

    return (<div>
        <Item product={product}/>
        <FlashSale isTopPicks={true}/>
    </div>);
};

export default Index;
