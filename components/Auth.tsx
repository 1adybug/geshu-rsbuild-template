import { FC, ReactNode } from "react"

import { Navigate, useLocation } from "react-router"

import { useGetAccount } from "@/hooks/useGetAccount"

export interface AuthProps {
    children?: ReactNode
}

const Auth: FC<AuthProps> = ({ children }) => {
    const { pathname, search } = useLocation()
    const { data, isLoading } = useGetAccount()

    if (isLoading) return null
    if (pathname === "/login" && !!data) return <Navigate to={new URLSearchParams(search).get("from") || "/"} replace />
    if (pathname !== "/login" && !data) return <Navigate to={`/login?from=${encodeURIComponent(`${pathname}${search}`)}`} replace />

    return children
}

export default Auth
