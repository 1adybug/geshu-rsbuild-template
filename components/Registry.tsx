import { FC, ReactNode } from "react"
import { StyleProvider } from "@ant-design/cssinjs"
import { HeroUIProvider, ToastProvider } from "@heroui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"
import dayjs from "dayjs"
import { NavigateOptions, useHref, useNavigate } from "react-router"

import "dayjs/locale/zh-cn"

dayjs.locale("zh-cn")

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
        mutations: {
            retry: 0,
        },
    },
})

export interface RegistryProps {
    children?: ReactNode
}

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NavigateOptions
    }
}

const Registry: FC<RegistryProps> = ({ children }) => {
    const navigate = useNavigate()

    return (
        <QueryClientProvider client={queryClient}>
            <StyleProvider hashPriority="high">
                <ConfigProvider locale={zhCN}>
                    <HeroUIProvider locale="zh-CN" className="h-full" navigate={navigate} useHref={useHref}>
                        <ToastProvider />
                        {children}
                    </HeroUIProvider>
                </ConfigProvider>
            </StyleProvider>
        </QueryClientProvider>
    )
}

export default Registry
