import { FC, useEffect, useState } from "react"

import { Button, Form, Input } from "antd"
import { useForm } from "antd/es/form/Form"
import FormItem from "antd/es/form/FormItem"
import { FormSubscribe } from "soda-antd"

import { LoginParams } from "@/apis/login"

import logo from "@/assets/logo.svg?url"

import { useLogin } from "@/hooks/useLogin"
import { useSendCaptcha } from "@/hooks/useSendCaptcha"

const Page: FC = () => {
    const [form] = useForm<LoginParams>()

    const { mutateAsync: login, isPending: isLoginPending } = useLogin()

    const { mutateAsync: sendCaptcha, isPending: isSendCaptchaPending } = useSendCaptcha({
        onSuccess() {
            setleft(60)
        },
    })

    const [left, setleft] = useState(0)

    useEffect(() => {
        if (left <= 0) return
        const timeout = setTimeout(() => setleft(l => l - 1), 1000)
        return () => clearTimeout(timeout)
    }, [left])

    const isRequesting = isLoginPending || isSendCaptchaPending

    function onFinish(values: LoginParams) {
        login(values)
    }

    return (
        <main className="grid h-full grid-cols-1 sm:grid-cols-2">
            <title>登录</title>
            <div className="relative p-8">
                <div className="flex items-center gap-2">
                    <div className="flex">
                        <img className="h-10" src={logo} alt="logo" />
                    </div>
                    <h1 className="text-2xl font-bold">格数科技</h1>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Form<LoginParams> name="login_form" form={form} className="w-72" initialValues={{ usernameOrPhone: "" }} onFinish={onFinish}>
                        <FormItem<LoginParams> name="usernameOrPhone">
                            <Input className="h-10" placeholder="用户名或手机号" autoComplete="off" />
                        </FormItem>
                        <div className="flex items-start gap-2">
                            <FormItem<LoginParams> name="code">
                                <Input className="h-10" placeholder="验证码" autoComplete="off" />
                            </FormItem>
                            <FormSubscribe selector={(store: LoginParams) => store.usernameOrPhone}>
                                {usernameOrPhone => (
                                    <Button
                                        role="button"
                                        className="!h-10 min-w-24"
                                        disabled={isRequesting || left > 0 || !usernameOrPhone?.trim()}
                                        onClick={() => sendCaptcha(usernameOrPhone?.trim())}
                                    >
                                        {left > 0 ? `${left} 秒后重试` : "发送验证码"}
                                    </Button>
                                )}
                            </FormSubscribe>
                        </div>
                        <FormSubscribe selector={(store: LoginParams) => store}>
                            {({ usernameOrPhone, code }) => (
                                <Button
                                    className="!h-10"
                                    type="primary"
                                    block
                                    disabled={isRequesting || !usernameOrPhone?.trim() || !code?.trim()}
                                    htmlType="submit"
                                >
                                    登录
                                </Button>
                            )}
                        </FormSubscribe>
                    </Form>
                </div>
            </div>
            <div className="hidden bg-[url('@/assets/login.webp')] bg-cover bg-bottom sm:block" />
        </main>
    )
}

export default Page
