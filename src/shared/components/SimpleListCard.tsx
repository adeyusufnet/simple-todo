import React from "react";
import { useLocation } from "react-router-dom"

const SimpleListCardComponent = React.memo((data: any) => {
    const location: any = useLocation();

    const propertiesByPathname = (value: any) => {
        if (location.pathname === "/") {
            return value?.nama
        } else if (location.pathname === "/product") {
            return value?.nama_produk
        } else if (location.pathname === "/todo") {
            return value?.name
        } else {
            return value?.id
        }
    }

    return (
        <>
            {data?.data?.map((result: any) => (
                <div className="simple-card" key={result?.id}>
                    <p>{propertiesByPathname(result)}</p>
                </div>
            ))}
        </>
    )
})

export default SimpleListCardComponent