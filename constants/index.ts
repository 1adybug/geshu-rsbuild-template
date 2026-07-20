import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
})

export const CookiePrefix = import.meta.env.PUBLIC_COOKIE_PREFIX

export const ApiOrigin = import.meta.env.PUBLIC_API_ORIGIN || location.origin

export const ApiPrefix = import.meta.env.PUBLIC_API_PREFIX
