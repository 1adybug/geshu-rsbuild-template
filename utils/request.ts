import { getErrorMessage, isPlainObject } from "deepsea-tools"

import { ApiOrigin, ApiPrefix } from "@/constants"

import { cookieStorage } from "@/utils/cookieStorage"

import { logout } from "./logout"

export interface ResponseData<T = any> {
    json: T
    blob: Blob
    text: string
    arrayBuffer: ArrayBuffer
    formData: FormData
    stream: Response
}

export type ResponseType = keyof ResponseData

export interface RequestOptions<T extends ResponseType = "json"> extends Omit<RequestInit, "body" | "method"> {
    // eslint-disable-next-line
    method?: "GET" | "POST" | "DELETE" | "HEAD" | "OPTIONS" | "PUT" | "PATCH" | "CONNECT" | "TRACE" | (string & {})
    /**
     * 响应的数据类型，默认 json
     * @default "json"
     */
    type?: T
    base?: string | URL

    body?: BodyInit | Record<string, any> | any[]
    search?: (string | number | boolean)[][] | Record<string | number | symbol, string | number | boolean> | string | URLSearchParams
    hideError?: boolean
}

export async function request<T = any>(input: string | URL, options?: RequestOptions<"json">): Promise<ResponseData<T>["json"]>
export async function request<P extends Exclude<ResponseType, "json">>(input: string | URL, options: RequestOptions<P>): Promise<ResponseData[P]>

export async function request<T = any, P extends ResponseType = "json">(input: string | URL, options?: RequestOptions<P>): Promise<ResponseData<T>[P]> {
    let { headers, type = "json", body, base, search = {}, method, hideError, ...rest } = options ?? {}

    const url = new URL(input, typeof input === "string" ? base || ApiOrigin?.trim() : undefined)

    if (ApiPrefix) url.pathname = `/${ApiPrefix}${url.pathname}`
    url.pathname = url.pathname.replace(/\/{2,}/g, "/")

    if (Array.isArray(search)) search = search.map(item => item.map(i => String(i)))
    if (isPlainObject(search)) search = Object.entries(search).map(([key, value]) => [key, String(value)])

    search = new URLSearchParams(search as any)

    if (url.search) url.search = `${url.search}&${search.toString()}`
    else url.search = search.toString()

    if (type !== "json" && type !== "blob" && type !== "text" && type !== "arrayBuffer" && type !== "formData" && type !== "stream")
        throw new Error(`Invalid response type: ${type}`)

    headers = new Headers(headers)
    const token = cookieStorage.getItem("token")
    headers.set("Authorization", `Bearer ${token}`)

    if (body && (isPlainObject(body) || Array.isArray(body))) {
        headers.set("Content-Type", "application/json")
        method ??= "POST"
        body = JSON.stringify(body)
    }

    try {
        const response = await fetch(url, { headers, body, method, ...rest } as RequestInit)

        switch (type) {
            case "json": {
                const json = await response.json()

                if (json.code === "302") {
                    logout()
                    throw new Error("登录已过期")
                }

                if (!json.success) throw new Error(json.message)
                return json.data
            }
            case "blob":
                return (await response.blob()) as any
            case "text":
                return (await response.text()) as any
            case "arrayBuffer":
                return (await response.arrayBuffer()) as any
            case "formData":
                return (await response.formData()) as any
            case "stream":
                return response as any
        }
    } catch (error) {
        if (error instanceof TypeError && error.message === "Failed to fetch") message.error("网络异常，请稍后再试")
        else if (!hideError) message.error(getErrorMessage(error))

        throw error
    }
}
