import { request } from "@/utils/request"

import { Account } from "./login"

export async function getAccount() {
    const response = await request<Account>("/auth/account", { hideError: true })
    return response
}
