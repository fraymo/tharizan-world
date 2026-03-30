// pages/api/products.js
export default async function handler(req, res) {
    const {categoryId} = req.query;
    let products = [];
    if (categoryId === "chicken-3") {
        products = [
            {
                name: "Regular - Curry Cut (Skin Off) With 1Pc Liver",
                description: "16 -18 Pieces",
                imgSrc: "/chicken1.webp",
                price: 199,
                discount: "₹10 Off",
                grossWeight: "480 - 500 Gms",
                trending: true,
                inStock: true,
                link: "/regular-chicken-with-liver",
            },
        ];
    } else if (categoryId === "mutton-4") {
        products = [
            {
                name: "Mutton Curry Cut",
                description: "16 -18 Pieces",
                imgSrc: "/mutton.jpeg",
                price: 499,
                discount: "₹20 Off",
                grossWeight: "480 - 500 Gms",
                trending: true,
                inStock: true,
                link: "/mutton-curry-cut",
            },
            // ... (more mutton products)
        ];
    }
    res.status(200).json(products);
}
