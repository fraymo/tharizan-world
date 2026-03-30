import { useEffect, useRef, useState } from "react";

export function useDebouncedFetch(fetchFn, deps = [], delay = 500) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        // debounce timer
        const handler = setTimeout(async () => {
            try {
                setLoading(true);
                setError(null);

                // cancel previous request if still running
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }

                const controller = new AbortController();
                abortControllerRef.current = controller;

                const result = await fetchFn({ signal: controller.signal });
                setData(result);
            } catch (err) {
                if (err.name === "AbortError") {
                    console.log("Request aborted");
                } else {
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        }, delay);

        return () => clearTimeout(handler);
    }, deps); // trigger whenever deps change

    return { data, loading, error };
}
