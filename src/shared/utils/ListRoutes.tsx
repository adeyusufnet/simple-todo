import HomepageComponent from "../components/Home"
import ProductComponent from "../components/Product"
import ToDoComponent from "../components/ToDo"
import TransactionComponent from "../components/Transaction"

export const ListRoutes = () => {
    return [
        {
            path: "/",
            element: <HomepageComponent />
        },
        {
            path: "product",
            element: <ProductComponent />
        },
        {
            path: "transaction",
            element: <TransactionComponent />
        },
        {
            path: "todo",
            element: <ToDoComponent />
        },
    ]
}