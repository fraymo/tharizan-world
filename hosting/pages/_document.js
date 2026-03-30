import { Head, Html, Main, NextScript } from "next/document";

export const metadata = {
  title: "Explore our premium and stunning Jewellery Online | Tharizan World",
  description:
    "Shop elegant gold, silver, and diamond jewellery online at Tharizan World. Discover our stunning collection of necklaces, bangles, earrings, rings, and bridal sets - all crafted with precision and timeless elegance. Enjoy secure online shopping and doorstep delivery with Tharizan World.",
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
