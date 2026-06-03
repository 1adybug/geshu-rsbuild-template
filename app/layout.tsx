import type { FC } from "react"

import { Outlet } from "react-router"

import Auth from "@/components/Auth"
import Registry from "@/components/Registry"

const Layout: FC = () => (
    <Registry>
        <Auth>
            <Outlet />
        </Auth>
    </Registry>
)

export default Layout
