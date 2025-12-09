import { mkdir, readdir, readFile, stat, writeFile } from "fs/promises"
import { join, parse } from "path"

await mkdir(".vscode", { recursive: true })

const content = await readdir(".vscode")

if (!content.includes("settings.json")) {
    await writeFile(
        ".vscode/settings.json",
        JSON.stringify(
            {
                "files.exclude": {
                    "components/Router.tsx": true,
                },
            },
            null,
            4,
        ),
    )
} else {
    const json = await readFile(".vscode/settings.json", "utf-8")
    const data = JSON.parse(json)
    data["files.exclude"] ??= {}
    data["files.exclude"]["components/Router.tsx"] = true
    await writeFile(".vscode/settings.json", JSON.stringify(data, null, 4))
}

export async function createRouter() {
    const imports: string[] = []

    function isLayout(name: string) {
        return /^layout\.[tj]sx?$/.test(name)
    }

    function isPage(name: string) {
        return /^page\.[tj]sx?$/.test(name)
    }

    const nameCount: Record<string, number> = {}

    function getExportName(name: string) {
        if (nameCount[name] === undefined) {
            nameCount[name] = 1
            return name
        }

        nameCount[name]++
        return `${name}${nameCount[name]}`
    }

    interface CheckFileExportParams {
        path: string
        name: string
    }

    async function checkFileExport({ path, name }: CheckFileExportParams) {
        const content = await readFile(path, "utf-8")
        return new RegExp(`^ *export +(const|let|var) +${name} = `, "m").test(content) || new RegExp(`^ *export +function +${name} *\\(`, "m").test(content)
    }

    interface GetRouteParams {
        dirs: string[]
        item: string
    }

    async function getRoute({ dirs, item }: GetRouteParams): Promise<Router> {
        const prefix =
            dirs.length === 1
                ? "Root"
                : dirs
                      .at(-1)!
                      .replace(/[\(\)\[\]:]/g, "")
                      .replace(/-([a-z])/g, (m, a) => a.toUpperCase())
        const { name } = parse(item)

        function getRouteExportName(name: string, upperCase = false) {
            return getExportName(`${prefix.replace(/^./, m => (upperCase ? m.toUpperCase() : m.toLowerCase()))}${name.replace(/^./, m => m.toUpperCase())}`)
        }

        const Component = getRouteExportName(name, true)
        const path = join(...dirs, item)
        const hasAction = await checkFileExport({ path, name: "action" })
        const action = hasAction ? getRouteExportName("action") : undefined
        const hasLoader = await checkFileExport({ path, name: "loader" })
        const loader = hasLoader ? getRouteExportName("loader") : undefined
        const hasShouldRevalidate = await checkFileExport({ path, name: "shouldRevalidate" })
        const shouldRevalidate = hasShouldRevalidate ? getRouteExportName("shouldRevalidate") : undefined

        const exports: string[] = []

        if (action) exports.push(`action as ${action}`)
        if (loader) exports.push(`loader as ${loader}`)
        if (shouldRevalidate) exports.push(`shouldRevalidate as ${shouldRevalidate}`)

        if (exports.length > 0) imports.push(`import ${Component}, { ${exports.join(", ")} } from "@/${dirs.map(item => `${item}/`).join("")}${item}"`)
        else imports.push(`import ${Component} from "@/${dirs.map(item => `${item}/`).join("")}${item}"`)

        function getHashName(name: string) {
            return `$$${name}$$`
        }

        return {
            Component: getHashName(Component),
            action: action ? getHashName(action) : undefined,
            loader: loader ? getHashName(loader) : undefined,
            shouldRevalidate: shouldRevalidate ? getHashName(shouldRevalidate) : undefined,
        }
    }

    function isGroup(name: string) {
        return /^\(.+?\)$/.test(name)
    }

    function getRoutePath(dirs: string[]) {
        const last = dirs.at(-1)!
        let path = dirs.length === 1 ? "/" : isGroup(last) ? undefined : last
        path = path?.replace(/^\[(.+?)\]$/, ":$1")
        return path
    }

    interface Router {
        path?: string
        index?: boolean
        loader?: string
        action?: string
        shouldRevalidate?: string
        Component?: string
        children?: Router[]
    }

    async function createRouter(...dirs: string[]): Promise<Router> {
        const content = await readdir(join(...dirs))
        const path = getRoutePath(dirs)
        let layout: Router | undefined
        let page: Router | undefined

        let children: Router[] = []

        for (const item of content) {
            const stats = await stat(join(...dirs, item))

            if (stats.isDirectory()) {
                const router = await createRouter(...dirs, item)
                children.push(router)
                continue
            }

            if (isLayout(item)) {
                layout = await getRoute({ dirs, item })
                continue
            }

            if (!isGroup(item) && isPage(item)) page = await getRoute({ dirs, item })
        }

        if (!layout && !page) {
            return {
                path,
                children: children.length > 0 ? children : undefined,
            }
        }

        if (layout && page) {
            return {
                path,
                ...layout,
                children: [
                    {
                        index: true,
                        ...page,
                    },
                    ...children,
                ],
            }
        }

        if (layout) {
            return {
                ...layout,
                children: children.length > 0 ? children : undefined,
            }
        }

        return children.length === 0
            ? {
                  path,
                  ...page,
              }
            : {
                  children: [
                      {
                          path,
                          ...page,
                      },
                      ...children,
                  ],
              }
    }

    const router = await createRouter("app")

    const str = JSON.stringify(router, null, 4)
        .replace(/^/gm, "    ")
        .replace(/^( *)"(.+?)":/gm, "$1$2:")
        .replace(/"\$\$(.+?)\$\$"/gm, "$1")

    const component = `import { FC } from "react"
import { RouterProvider, createBrowserRouter } from "react-router"

${imports.join("\n")}

const router = createBrowserRouter([
${str}
])

const Router: FC = () => <RouterProvider router={router} />

export default Router
`

    await writeFile("components/Router.tsx", component)
}
