import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import { pluginSvgr } from "@rsbuild/plugin-svgr"
import { sdrrRsbuildPlugin } from "sdrr/rsbuild"

function getDevelopmentPort() {
    const value = process.env.PORT?.trim()
    if (!value) return 5173

    const port = Number(value)

    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`PORT 必须是 1 到 65535 之间的整数，当前值为 ${JSON.stringify(value)}`)

    return port
}

export default defineConfig({
    source: {
        entry: {
            index: "./index.tsx",
        },
    },
    html: {
        title: "格数科技",
        meta: {
            description: "powered by geshu",
        },
        mountId: "root",
    },
    plugins: [
        pluginReact({
            reactCompiler: true,
        }),
        pluginSvgr(),
        sdrrRsbuildPlugin(),
    ],
    server: {
        port: getDevelopmentPort(),
    },
    output: {
        polyfill: "entry",
    },
})
