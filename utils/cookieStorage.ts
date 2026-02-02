import { CookieAttributes, createCookieStorage } from "deepsea-tools"

import { CookiePrefix } from "@/constants"

const prefix = CookiePrefix?.trim() ?? ""

const _cookieStorage = createCookieStorage()

export const cookieStorage = new Proxy(_cookieStorage, {
    get(target, property) {
        const prop = property as keyof typeof target

        if (prop === "getItem") {
            return function getItem(key: string) {
                key = `${prefix}${key}`
                return target.getItem(key)
            }
        }

        if (prop === "setItem") {
            return function setItem(key: string, value: string, options?: CookieAttributes) {
                key = `${prefix}${key}`
                return target.setItem(key, value, options)
            }
        }

        if (prop === "removeItem") {
            return function removeItem(key: string) {
                key = `${prefix}${key}`
                return target.removeItem(key)
            }
        }

        return target[prop]
    },
})
