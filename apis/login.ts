import { request } from "@/utils/request"

export interface LoginParams {
    usernameOrPhone: string
    code: string
}

export const Role = {
    管理员: "Admin",
    用户: "User",
} as const

export type Role = (typeof Role)[keyof typeof Role]

export interface Account {
    id: string
    username: string
    token: string
    role: Role
}

export async function login(param: LoginParams) {
    const response = await request<Account>("/auth/login", {
        method: "POST",
        body: param,
    })
    return response
}
