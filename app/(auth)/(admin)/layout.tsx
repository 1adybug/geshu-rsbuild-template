import { FC, ReactNode } from "react"

import { Navigate } from "react-router"

import { Role } from "@/apis/login"

import { useGetAccount } from "@/hooks/useGetAccount"

export interface LayoutProps {
    children?: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
    const { data } = useGetAccount()
    if (data?.role !== Role.管理员) return <Navigate to="/" />
    return children
}

export default Layout
