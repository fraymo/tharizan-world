import useSWR from "swr";
import {fetchApi, getTenantHeaders} from "@/utils/util";
import {useStorefront} from "@/context/StorefrontContext";

const fetcher = (url, tenant) => fetchApi(url, {headers: getTenantHeaders({}, tenant)});

export default function useFetch(url, options = {}) {
    const {tenant} = useStorefront();
    const enabled = Boolean(url && tenant?.sellerEmail);

    const {data, error, isLoading, mutate} = useSWR(
        enabled ? [url, tenant] : null,
        ([requestUrl, requestTenant]) => fetcher(requestUrl, requestTenant),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 0,
            dedupingInterval: Infinity,
            shouldRetryOnError: false,
            ...options,
        }
    );

    return {
        data,
        error,
        isLoading: enabled ? isLoading : false,
        mutate,
    };
}
