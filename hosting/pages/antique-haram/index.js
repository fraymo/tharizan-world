import React, { useState } from 'react';

// --- Helper Data ---
// This would typically come from an API
const product = {
  id: 'M78552',
  name: 'Thogai Mittai - Varalakshmi',
  price: 1029.00,
  imageUrl: 'https://placehold.co/600x600/f2e9e4/4a4a4a?text=Necklace',
  stock: 8,
};

const relatedProducts = [
  { id: 1, name: 'Fabulous Necklace', price: 939.00, imageUrl: 'https://placehold.co/300x300/f2e9e4/4a4a4a?text=Product+1' },
  { id: 2, name: 'Lakshmi Spin Floral Necklace', price: 888.00, imageUrl: 'https://placehold.co/300x300/f2e9e4/4a4a4a?text=Product+2' },
  { id: 3, name: 'Ivy Floral Mittai', price: 969.00, imageUrl: 'https://placehold.co/300x300/f2e9e4/4a4a4a?text=Product+3' },
  { id: 4, name: 'Nita Ambani Haaram Set', price: 2089.00, imageUrl: 'https://placehold.co/300x300/f2e9e4/4a4a4a?text=Product+4' },
];

const accordionItems = [
    { title: 'Description', content: 'This beautiful Thogai Mittai necklace is crafted with precision and care, featuring an intricate design inspired by traditional Varalakshmi patterns. Perfect for festive occasions and weddings.' },
    { title: 'Our Promise To You', content: 'We promise to deliver only the highest quality jewelry, crafted from authentic materials. Each piece comes with a certificate of authenticity and a one-year warranty.' },
    { title: 'International Orders', content: 'We ship worldwide! International shipping rates and times vary by location. Please proceed to checkout to see the options available for your country.' },
];

// --- SVG Icons ---
// Using inline SVGs to keep everything in one file
const HeartIcon = ({ isFilled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
         fill={isFilled ? 'currentColor' : 'none'} 
         stroke="currentColor" 
         strokeWidth="2" 
         strokeLinecap="round" 
         strokeLinejoin="round" 
         className="w-5 h-5 mr-2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
        <polyline points="16 6 12 2 8 6"></polyline>
        <line x1="12" y1="2" x2="12" y2="15"></line>
    </svg>
);

const ChevronDownIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <svg 
        onClick={onClick} 
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`w-6 h-6 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


// --- Reusable Components ---
const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center py-4 text-left text-gray-800 hover:bg-gray-50 focus:outline-none"
      >
        <span className="font-semibold">{title}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 pt-0 text-gray-600">
          {content}
        </div>
      </div>
    </div>
  );
};

const ReviewForm = ({ onSubmit, onCancel }) => {
    const [author, setAuthor] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (author && rating && text) {
            onSubmit({ author, rating, text });
        } else {
            // In a real app, you'd show a more elegant error message.
            alert('Please fill out all fields.');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md relative">
                <button onClick={onCancel} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h2 className="text-2xl font-bold mb-6 text-center">Write a Review</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div className="mb-4">
                         <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                         <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                                <StarIcon 
                                    key={star}
                                    filled={star <= (hoverRating || rating)}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                         </div>
                    </div>
                    <div className="mb-6">
                         <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                         <textarea id="text" value={text} onChange={(e) => setText(e.target.value)} rows="4" className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-[#800020] text-white py-2 rounded-md hover:bg-opacity-90 transition">Submit Review</button>
                </form>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [quantity, setQuantity] = useState(1);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviews, setReviews] = useState([
        { author: 'Priya S.', rating: 5, text: 'Absolutely stunning piece of jewelry! The craftsmanship is top-notch. Highly recommended.' }
    ]);
    const [copySuccess, setCopySuccess] = useState('');

    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const handleAccordionClick = (index) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    const handleToggleWishlist = () => {
        setIsInWishlist(!isInWishlist);
    };
    
    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out this beautiful necklace: ${product.name}`,
            url: window.location.href,
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Share failed:", err.message);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopySuccess('Link copied!');
                setTimeout(() => setCopySuccess(''), 2000); // Hide message after 2 seconds
            } catch (err) {
                setCopySuccess('Failed to copy!');
                 setTimeout(() => setCopySuccess(''), 2000);
            }
        }
    };
    
    const handleReviewSubmit = (review) => {
        setReviews([review, ...reviews]);
        setShowReviewForm(false);
    };

    return (
<div className="bg-white font-sans min-h-screen text-[#4A4A4A]">
            {showReviewForm && <ReviewForm onSubmit={handleReviewSubmit} onCancel={() => setShowReviewForm(false)} />}
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row -mx-4 py-8">
                    
                    {/* Left Side: Sticky Image */}
                    <aside className="w-full lg:w-1/2 px-4">
                        <div className="lg:sticky lg:top-8">
                            <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                            />
                        </div>
                    </aside>

                    {/* Right Side: Scrollable Details */}
                    <main className="w-full lg:w-1/2 px-4 mt-8 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                        <p className="text-2xl mt-2 text-gray-700">Rs. {product.price.toFixed(2)}</p>
                        
                        <div className="mt-6">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-600">Quantity</label>
                            <div className="flex items-center mt-1">
                                <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100">-</button>
                                <input type="text" id="quantity" value={quantity} readOnly className="w-12 text-center border-t border-b border-gray-300"/>
                                <button onClick={() => handleQuantityChange(1)} className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100">+</button>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <button className="w-full bg-[#8B4513] text-white py-3 rounded-md hover:bg-opacity-90 transition duration-300">Add to cart</button>
                            <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-300">Buy it now</button>
                        </div>
                        
                        <div className="mt-6 border-t border-gray-200 pt-4 flex items-center">
                           <img src="https://placehold.co/80x80/f2e9e4/4a4a4a?text=Chain" alt="Back Chain" className="w-20 h-20 rounded-md object-cover"/>
                           <div className="ml-4">
                                <p className="font-semibold">Back Chain</p>
                                <p className="text-gray-600">Rs. 60</p>
                                <button className="text-sm text-[#8B4513] border border-[#8B4513] px-3 py-1 rounded-md mt-1 hover:bg-[#8B4513] hover:text-white transition">Add to Cart</button>
                           </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500 font-semibold">Guarantee Safe Checkout:</p>
                            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
                               <span>G Pay</span> | <span>UPI</span> | <span>VISA</span> | <span>Mastercard</span> | <span>PayPal</span>
                            </div>
                        </div>

                        {product.stock < 10 && (
                             <p className="text-red-600 font-bold mt-6">* Low stock: {product.stock} left</p>
                        )}
                        
                        <div className="mt-4 flex flex-col space-y-4">
                           <button onClick={handleToggleWishlist} className={`flex items-center transition ${isInWishlist ? 'text-red-500' : 'text-gray-700 hover:text-[#8B4513]'}`}>
                                <HeartIcon isFilled={isInWishlist}/>
                                {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                           </button>
                        </div>

                        <div className="mt-8">
                          {accordionItems.map((item, index) => (
                              <AccordionItem 
                                key={index}
                                title={item.title}
                                content={item.content}
                                isOpen={openAccordion === index}
                                onClick={() => handleAccordionClick(index)}
                              />
                          ))}
                        </div>
                         <div className="flex items-center mt-4 text-gray-700">
                            <p className="font-semibold text-sm">{product.id}</p>
                        </div>
                        <div className="mt-4 flex items-center">
                            <button onClick={handleShare} className="flex items-center hover:text-[#8B4513] transition">
                                <ShareIcon />
                                Share
                            </button>
                            {copySuccess && <span className="ml-4 text-sm text-green-600">{copySuccess}</span>}
                        </div>
                    </main>
                </div>
                
                <div className="border-t border-gray-200 py-12">
                     <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customer Reviews</h2>
                        {reviews.length === 0 ? (
                            <>
                                <div className="flex justify-center items-center mt-2 text-gray-400"><span>☆☆☆☆☆</span></div>
                                <p className="mt-2 text-sm text-gray-600">Be the first to write a review</p>
                            </>
                        ) : (
                           <div className="mt-4 max-w-2xl mx-auto">
                               {reviews.map((review, index) => (
                                   <div key={index} className="text-left border-b py-4">
                                       <div className="flex items-center mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} filled={i < review.rating} />
                                            ))}
                                            <p className="ml-2 font-bold">{review.author}</p>
                                       </div>
                                       <p className="text-gray-600">{review.text}</p>
                                   </div>
                               ))}
                           </div>
                        )}
                        <button onClick={() => setShowReviewForm(true)} className="mt-6 bg-[#800020] text-white px-8 py-2 rounded-md hover:bg-opacity-90 transition">Write a review</button>
                     </div>
                </div>

                <div className="py-12">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">You may also like</h2>
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
                        {relatedProducts.map(item => (
                            <div key={item.id} className="group relative">
                                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-center object-cover" />
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm text-gray-700">
                                            <a href="#">
                                                <span aria-hidden="true" className="absolute inset-0"></span>
                                                {item.name}
                                            </a>
                                        </h3>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Rs. {item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

