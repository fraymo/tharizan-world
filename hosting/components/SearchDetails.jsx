import React from "react";
import {fetchApi, getCustomerEmail, seller_email} from "@/utils/util";
import {formatCurrency} from "@/utils/formatCurrency";
import {useDebouncedFetch} from "./useDebouncedFetch";
import {useRouter} from "next/navigation";

const App = ({query}) => {
    const router = useRouter();
    const {data: products = [], loading, error} = useDebouncedFetch(async ({signal}) => {
            return await fetchApi("/searchProduct", {
                headers: {'Content-Type': 'application/json',  'x-user': seller_email},
                method: "POST", body: {
                    seller_email, customer_email: getCustomerEmail(), query,
                }, signal,
            });
        }, [query], // dependencies (debounced on query change)
        500      // debounce delay (ms)
    );

    const gotoProduct = async (e, product) => {
        e.preventDefault();
        if(product.status === "1") {
            localStorage.setItem("selected-product", JSON.stringify(product));
            const {_id: productId, category: {_id: categoryId, name:categoryName }, title, subCategory: {_id: subCategoryId, name:subCategoryName} } = product;
            await router.push(`/${categoryName}/${subCategoryName}/${title}?productId=${productId}`);
        }
    };

    return (<div className="bg-gray-100 min-h-screen p-4 sm:p-8 font-sans">
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Our Products</h1>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">Error loading products</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products && products.map((product) => (<div
                    onClick={(e) => gotoProduct(e,product)}
                    key={product._id}
                    className="bg-white rounded-xl shadow-lg p-2 flex items-center transition-transform duration-300 hover:shadow-xl hover:scale-[1.01] cursor-pointer"
                >
                    <img
                        src={product.images[0].Location}
                        alt={product.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-grow flex items-center justify-between pl-4">
                        <div className="flex flex-col flex-grow">
                            <h3 className="text-gray-900 font-medium text-sm leading-snug">
                                {product.title}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1 leading-tight">
                                Gross: {product.grossWeight}
                            </p>
                        </div>
                        <div className="flex flex-col items-end text-right">
                            <div className="flex items-baseline gap-1">
                                {product.MRP && (<span className="text-xs text-gray-500 line-through">
                        {formatCurrency(product.MRP)}
                      </span>)}
                                <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(product.sellingPrice)}
                    </span>
                            </div>
                            {product.status == 1 ? (<button
                                onClick={() => gotoProduct(product)}
                                className="bg-red-600 text-white text-xs px-5 py-1.5 rounded-full mt-2 hover:bg-red-700 transition-colors duration-200">
                                IN STOCK
                            </button>) : (<div className="text-center">
                                <p className="text-[11px] text-gray-500 mt-1">
                                    OUT OF STOCK
                                </p>
                                <button
                                    disabled
                                    className="bg-gray-200 text-gray-500 text-xs px-5 py-1.5 rounded-full cursor-not-allowed mt-1"
                                >
                                    Notify me
                                </button>
                            </div>)}
                        </div>
                    </div>
                </div>))}
            </div>
        </div>
    </div>);
};
export default App;
