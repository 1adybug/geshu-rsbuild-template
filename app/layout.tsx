import { FC } from "react"

import { Outlet } from "react-router"

import Auth from "@/components/Auth"
import Registry from "@/components/Registry"

const Layout: FC = () => (
    <Auth>
        <Registry>
            <Outlet />
        </Registry>
    </Auth>
)

export default Layout
