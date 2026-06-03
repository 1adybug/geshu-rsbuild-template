import { request } from "@/utils/request"

import type { Account } from "./login"

export async function getAccount() {
    const response = await request<Account>("/auth/account", { hideError: true })
    return response
}
