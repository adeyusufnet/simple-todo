import { Link } from "react-router-dom"
import { ListRoutes } from "../utils/ListRoutes"

export default function MenuComponent() {
    return (
        <div className="container-menu">
            <div className="content-menu">
                {Array?.isArray(ListRoutes()) && ListRoutes()?.map((menu) => {
                    return (
                        <Link className="menu-link" to={menu?.path}>{menu?.title}</Link>
                    )
                })}
            </div>
        </div>
    )
}