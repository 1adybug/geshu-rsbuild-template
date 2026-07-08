import { useId } from "react"

import { createUseMutation } from "soda-tanstack-query"

import { sendCaptcha } from "@/apis/sendCaptcha"

export const useSendCaptcha = createUseMutation(() => {
    const key = useId()

    return {
        mutationFn: sendCaptcha,
        onSuccess(data) {
            message.open({
                key,
                type: "success",
                content: `验证码已发送至 ${data.phone}`,
            })
        },
        onError() {
            message.destroy(key)
        },
    }
})
