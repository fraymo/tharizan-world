
import React, { useEffect, useState } from 'react';
import {fetchApi, getCustomerEmail, seller_email, updateCart} from "@/utils/util";
import {store} from "@/redux/store";
import NoProductsFound from "@/components/NoProductFound";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);


  const getList = async () => {
      try{
          const list = await fetchApi("/cart/getWishlist", {
              headers: {'Content-Type': 'application/json',  'x-user': seller_email},
              method: 'POST',
              body: {
                  seller_email,
                  customer_email: getCustomerEmail()
              }
          });
          updateCart(store);
          setWishlist(list);
      }
      catch (e) {
       setWishlist([]);
      }
  }

  useEffect(() => {
    // Fetch wishlist items from an API
      getList();
  }, []);

  const handleMoveToCart = async (item) => {
    try{
        const res = await fetchApi("/cart/wishlist-to-cart", {
            headers: {'Content-Type': 'application/json',  'x-user': seller_email},
            method:'POST',
            body: {
                seller_email,
                customer_email: getCustomerEmail(),
                ...item
            }
        });
        if(res.success){
            getList();
        }
    }
    catch (e) {
        alert('Not able to move to the cart')
    }
  };

  const handleRemoveFromWishlist = async (_id) => {
      try{
          const res = await fetchApi("/cart/removeWishlist", {
              headers: {'Content-Type': 'application/json',  'x-user': seller_email},
              method:'DELETE',
              body: {
                  seller_email,
                  customer_email: getCustomerEmail(),
                  _id
              }
          });
          if(res.success){
              getList();
          }
      }
      catch (e) {
          alert('Not able to remove the wishlist')
      }
  };

  return (
    <div className="container mx-auto p-4">
      {wishlist.length === 0 ? (
          <NoProductsFound
              title={`Your wishlist is empty.`}
              description="Add your favourite product"
              ctaHref={'/'}
              showSuggestion={false}
              suggestions={[{title: 'Bracelets', href: '/category/bracelets'}]}
              isNeedCleanFilter={false}
              onClear={() => { /* custom clear logic */ }}
          />
      ) : (
          <>
              <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div key={item._id} className="border rounded-lg p-4">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-4" />
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">${item.price}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
          </>
      )}
    </div>
  );
};

export default Wishlist;
