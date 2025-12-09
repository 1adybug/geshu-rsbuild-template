import { defineConfig } from "@rsbuild/core"
import { pluginBabel } from "@rsbuild/plugin-babel"
import { pluginReact } from "@rsbuild/plugin-react"
import { pluginSvgr } from "@rsbuild/plugin-svgr"

export default defineConfig({
    source: {
        entry: {
            index: "./index.tsx",
        },
    },
    html: {
        title: "geshu rsbuild template",
        meta: {
            description: "powered by geshu",
        },
        mountId: "root",
    },
    plugins: [
        pluginReact(),
        pluginBabel({
            include: /\.(?:jsx|tsx)$/,
            babelLoaderOptions(config) {
                config.plugins ??= []
                config.plugins?.unshift("babel-plugin-react-compiler")
            },
        }),
        pluginSvgr(),
    ],
    server: {
        port: 5173,
    },
    output: {
        polyfill: "entry",
    },
})
