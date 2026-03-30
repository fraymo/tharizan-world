
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      name: 'Product 1',
      price: 100,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Product 2',
      price: 200,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'Product 3',
      price: 300,
      image: 'https://via.placeholder.com/150',
    },
  ]);
}
