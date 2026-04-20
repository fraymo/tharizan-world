import Head from "next/head";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import "../styles/globals.css";
import { useEffect } from "react";
import Layout from "@/components/layout";
import { updateCart } from "@/utils/util";
import { useRouter } from "next/router";
import {StorefrontProvider, useStorefront} from "@/context/StorefrontContext";
import StoreUnavailableScreen from "@/components/StoreUnavailableScreen";

function AppShell({Component, pageProps}) {
  const router = useRouter();
  const {tenant, storeUnavailable} = useStorefront();
  const isSlugStorefront = router.pathname === "/[category]" && !router.asPath.includes("categoryId=");

  useEffect(() => {
    if (isSlugStorefront) {
      return;
    }

    if (tenant?.sellerId && tenant?.sellerEmail) {
      updateCart(store, tenant);
    }
  }, [isSlugStorefront, tenant?.sellerId, tenant?.sellerEmail]);

  if (isSlugStorefront && storeUnavailable) {
    return <StoreUnavailableScreen/>;
  }

  const page = <Component {...pageProps} />;
  return <Layout>{page}</Layout>;
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Modern Hub Storefronts</title>
        <meta
          name="description"
          content="Explore Modern Hub promotional products and seller-powered storefronts with slug-based shopping experiences."
        />
      </Head>
      <Provider store={store}>
        <StorefrontProvider>
          <AppShell Component={Component} pageProps={pageProps} />
        </StorefrontProvider>
      </Provider>
    </>
  );
}

export default MyApp;
