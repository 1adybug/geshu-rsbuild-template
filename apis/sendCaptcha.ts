import { request } from "@/utils/request"

export interface SendCaptchaResponse {
    phone: string
    username: string
}

export async function sendCaptcha(usernameOrPhone: string) {
    const response = await request<SendCaptchaResponse>("/auth/getCaptcha", { body: { usernameOrPhone } })
    return response
}
