"use client";
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import {clearConsumerSession, fetchApi, fetchStoreConfigBySlugSafe, getStoredTenant, setStoredTenant} from "@/utils/util";

const DEFAULT_STORE_SLUG = process.env.NEXT_PUBLIC_DEFAULT_STORE_SLUG || "modern-hub";
const DEFAULT_SELLER_EMAIL = process.env.NEXT_PUBLIC_SELLER_EMAIL || "";
const DEFAULT_STORE_NAME = process.env.NEXT_PUBLIC_DEFAULT_STORE_NAME || "Modern Hub";
const DEFAULT_STORE_TAGLINE = process.env.NEXT_PUBLIC_DEFAULT_STORE_TAGLINE || "Featured products, promotional drops, and curated collections.";
const isStoreUnavailableError = (error) => {
  const message = error?.message?.toString?.().toLowerCase?.() || "";
  return message.includes("store not found");
};
const StorefrontContext = createContext({
  tenant: null,
  loading: true,
  storeUnavailable: false,
  setTenant: () => {},
  markStoreUnavailable: () => {},
  refreshDefaultTenant: async () => null,
});

const normalizeTenant = (value) => value ? ({
  sellerId: value.sellerId || "",
  sellerEmail: value.sellerEmail || "",
  slug: value.slug || "",
  storefrontUrl: value.storefrontUrl || "",
  storeName: value.storeName || "",
  sellerName: value.sellerName || "",
  slogan: value.slogan || "",
  logo: value.logo || "",
}) : null;

export function StorefrontProvider({children}) {
  const router = useRouter();
  const [tenant, setTenantState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeUnavailable, setStoreUnavailable] = useState(false);
  const storeSlug = typeof router.query?.storeSlug === "string" ? router.query.storeSlug : "";

  const setTenant = useCallback((value) => {
    const normalized = normalizeTenant(value);
    setStoreUnavailable(false);
    setTenantState(normalized);
    setStoredTenant(normalized);
  }, []);

  const markStoreUnavailable = useCallback(() => {
    clearConsumerSession();
    setTenantState(null);
    setStoredTenant(null);
    setStoreUnavailable(true);
  }, []);

  const refreshDefaultTenant = useCallback(async () => {
    if (!DEFAULT_STORE_SLUG && !DEFAULT_SELLER_EMAIL) {
      setLoading(false);
      return null;
    }

    let normalized = null;

    if (DEFAULT_STORE_SLUG) {
      try {
        const store = await fetchApi(`/posts/store-config-by-slug/${DEFAULT_STORE_SLUG}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-user": DEFAULT_STORE_SLUG
          }
        });
        normalized = normalizeTenant(store);
      } catch (error) {
        if (!isStoreUnavailableError(error)) {
          console.warn("default-slug-tenant-miss", error?.message || error);
        }
      }
    }

    if (!normalized && DEFAULT_SELLER_EMAIL) {
      normalized = normalizeTenant({
        sellerEmail: DEFAULT_SELLER_EMAIL,
        storeName: DEFAULT_STORE_NAME,
        slogan: DEFAULT_STORE_TAGLINE,
        slug: ""
      });
    }

    setTenant(normalized);
    return normalized;
  }, [setTenant]);

  const refreshTenantBySlug = useCallback(async (slug) => {
    if (!slug) {
      return null;
    }

    const result = await fetchStoreConfigBySlugSafe(slug);
    if (!result.ok || !result.data) {
      markStoreUnavailable();
      return null;
    }

    const normalized = normalizeTenant(result.data);
    setTenant(normalized);
    return normalized;
  }, [markStoreUnavailable, setTenant]);

  useEffect(() => {
    let isMounted = true;
    const storedTenant = getStoredTenant();
    const isHomeRoute = router.pathname === "/";

    if (storedTenant && !isHomeRoute) {
      setTenantState(storedTenant);
    }

    if (isHomeRoute) {
      setTenantState(null);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    if (storeSlug) {
      const loadTenantBySlug = async () => {
        setLoading(true);
        try {
          await refreshTenantBySlug(storeSlug);
        } catch (error) {
          markStoreUnavailable();
          if (!isStoreUnavailableError(error)) {
            console.warn("slug-tenant-load", error?.message || error);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      loadTenantBySlug();
      return () => {
        isMounted = false;
      };
    }

    const isSlugStorefront = router.pathname === "/[category]" && !router.asPath.includes("categoryId=");
    if (isSlugStorefront) {
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const loadDefaultTenant = async () => {
      if (!isHomeRoute && storedTenant?.sellerId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const defaultTenant = await refreshDefaultTenant();
        if (!isMounted && defaultTenant) {
          return;
        }
      } catch (error) {
        console.error("default-tenant-load", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDefaultTenant();

    return () => {
      isMounted = false;
    };
  }, [router.asPath, router.pathname, refreshDefaultTenant, refreshTenantBySlug, storeSlug, markStoreUnavailable]);

  const value = useMemo(() => ({
    tenant,
    loading,
    storeUnavailable,
    setTenant,
    markStoreUnavailable,
    refreshDefaultTenant
  }), [tenant, loading, storeUnavailable, refreshDefaultTenant, setTenant, markStoreUnavailable]);

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
}

export const useStorefront = () => useContext(StorefrontContext);
