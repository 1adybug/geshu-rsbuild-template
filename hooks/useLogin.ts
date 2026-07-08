import { useId } from "react"

import { createUseMutation } from "soda-tanstack-query"

import { login } from "@/apis/login"

import { cookieStorage } from "@/utils/cookieStorage"

export const useLogin = createUseMutation(() => {
    const key = useId()

    return {
        mutationFn: login,
        onMutate() {
            message.open({
                key,
                type: "loading",
                content: `登录中...`,
                duration: 0,
            })
        },
        onSuccess(data, variables, onMutateResult, context) {
            cookieStorage.setItem("token", data.token)
            context.client.invalidateQueries({ queryKey: ["get-account", undefined] })

            message.open({
                key,
                type: "success",
                content: `登录成功`,
            })
        },
        onError() {
            message.destroy(key)
        },
    }
})
