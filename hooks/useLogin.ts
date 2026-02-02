import { useId } from "react"

import { useMutation, UseMutationOptions } from "@tanstack/react-query"

import { login } from "@/apis/login"

import { cookieStorage } from "@/utils/cookieStorage"

export interface UseLoginParams<TOnMutateResult = unknown> extends Omit<
    UseMutationOptions<Awaited<ReturnType<typeof login>>, Error, Parameters<typeof login>[0], TOnMutateResult>,
    "mutationFn"
> {}

export function useLogin<TOnMutateResult = unknown>({ onMutate, onSuccess, onError, onSettled, ...rest }: UseLoginParams<TOnMutateResult> = {}) {
    const key = useId()

    return useMutation({
        mutationFn: login,
        onMutate(variables, context) {
            message.open({
                key,
                type: "loading",
                content: `登录中...`,
                duration: 0,
            })

            return onMutate?.(variables, context) as TOnMutateResult | Promise<TOnMutateResult>
        },
        onSuccess(data, variables, onMutateResult, context) {
            cookieStorage.setItem("token", data.token)

            context.client.invalidateQueries({ queryKey: ["get-account"] })

            message.open({
                key,
                type: "success",
                content: `登录成功`,
            })

            return onSuccess?.(data, variables, onMutateResult, context)
        },
        onError(error, variables, onMutateResult, context) {
            message.destroy(key)

            return onError?.(error, variables, onMutateResult, context)
        },
        onSettled(data, error, variables, onMutateResult, context) {
            return onSettled?.(data, error, variables, onMutateResult, context)
        },
        ...rest,
    })
}
