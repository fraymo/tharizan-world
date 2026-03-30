import Head from "next/head";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import "../styles/globals.css";
import { useEffect } from "react";
import Layout from "@/components/layout";
import { updateCart } from "@/utils/util";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    updateCart(store);
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Explore our premium and stunning Jewellery Online | Tharizan World</title>
        <meta
          name="description"
          content="Shop elegant gold, silver, and diamond jewellery online at Tharizan World. Discover our stunning collection of necklaces, bangles, earrings, rings, and bridal sets - all crafted with precision and timeless elegance. Enjoy secure online shopping and doorstep delivery with Tharizan World."
        />
      </Head>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  );
}

export default MyApp;
