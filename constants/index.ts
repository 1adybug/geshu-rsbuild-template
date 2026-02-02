import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
        mutations: {
            retry: 0,
        },
    },
})

export const CookiePrefix = process.env.PUBLIC_COOKIE_PREFIX

export const ApiOrigin = process.env.PUBLIC_API_ORIGIN || location.origin

export const ApiPrefix = process.env.PUBLIC_API_PREFIX
