import { type FC, type ReactNode, useEffect } from "react"

import { StyleProvider } from "@ant-design/cssinjs"
import { QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider } from "antd"
import type { MessageInstance } from "antd/es/message/interface"
import useMessage from "antd/es/message/useMessage"
import zhCN from "antd/locale/zh_CN"
import dayjs from "dayjs"

import { queryClient } from "@/constants"

import "dayjs/locale/zh-cn"

dayjs.locale("zh-cn")

export interface RegistryProps {
    children?: ReactNode
}

declare global {
    var message: MessageInstance
}

export const Registry: FC<RegistryProps> = ({ children }) => {
    const [message, context] = useMessage()

    useEffect(() => {
        globalThis.message = message
    }, [message])

    return (
        <QueryClientProvider client={queryClient}>
            <StyleProvider hashPriority="high" layer>
                <ConfigProvider locale={zhCN} theme={{ token: { fontFamily: "Source Han Sans SC VF" } }}>
                    {context}
                    {children}
                </ConfigProvider>
            </StyleProvider>
        </QueryClientProvider>
    )
}
