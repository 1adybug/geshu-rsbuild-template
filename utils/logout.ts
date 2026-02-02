import { Account } from "@/apis/login"

import { queryClient } from "@/constants"

import { cookieStorage } from "./cookieStorage"

export function logout() {
    cookieStorage.removeItem("token")
    queryClient.setQueryData<Account | null>(["get-account"], null)
}
