import { useId } from "react"

import { useMutation, UseMutationOptions } from "@tanstack/react-query"

import { sendCaptcha } from "@/apis/sendCaptcha"

export interface UseSendCaptchaParams<TOnMutateResult = unknown> extends Omit<
    UseMutationOptions<Awaited<ReturnType<typeof sendCaptcha>>, Error, Parameters<typeof sendCaptcha>[0], TOnMutateResult>,
    "mutationFn"
> {}

export function useSendCaptcha<TOnMutateResult = unknown>({ onMutate, onSuccess, onError, onSettled, ...rest }: UseSendCaptchaParams<TOnMutateResult> = {}) {
    const key = useId()

    return useMutation({
        mutationFn: sendCaptcha,
        onMutate(variables, context) {
            return onMutate?.(variables, context) as TOnMutateResult | Promise<TOnMutateResult>
        },
        onSuccess(data, variables, onMutateResult, context) {
            message.open({
                key,
                type: "success",
                content: `验证码已发送至 ${data.phone}`,
            })

            return onSuccess?.(data, variables, onMutateResult, context)
        },
        onError(error, variables, onMutateResult, context) {
            return onError?.(error, variables, onMutateResult, context)
        },
        onSettled(data, error, variables, onMutateResult, context) {
            return onSettled?.(data, error, variables, onMutateResult, context)
        },
        ...rest,
    })
}
