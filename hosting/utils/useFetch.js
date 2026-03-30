import useSWR from "swr";
import {fetchApi} from "@/utils/util";

// Default fetcher for SWR
const fetcher = (url, email) => fetchApi(url, {headers: {'X-USER': email}});
const email = process.env.NEXT_PUBLIC_SELLER_EMAIL;
/**
 * useFetch - Reusable SWR hook
 * @param {string|null} url - API endpoint (null disables fetch)
 * @param {object} options - SWR options (e.g., revalidateOnFocus, refreshInterval)
 */
export default function useFetch(url, options = {}) {

    const {data, error, isLoading, mutate} = useSWR([url, email], ([url, id]) => fetcher(url, id), {
        // 🚫 turn off ALL automatic revalidations
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        dedupingInterval: Infinity, // 🚫 never auto refetch within interval
        shouldRetryOnError: false,  // 🚫 don’t retry
        ...options,
    });

    return {
        data,
        error,
        isLoading,
        mutate, // allows manual refresh
    };
}
