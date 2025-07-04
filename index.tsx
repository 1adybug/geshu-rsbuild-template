import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import App from "./App"

import "@ant-design/v5-patch-for-react-19"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
