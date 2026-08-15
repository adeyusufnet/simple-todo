import NotFoundComponent from "../components/NotFound"
import ProductComponent from "../components/Product"
import ToDoComponent from "../components/ToDo"
import TransactionComponent from "../components/Transaction"
import UsersComponent from "../components/Users"

export const ListRoutes = () => {
    return [
        {
            path: "/",
            title: "Home",
            element: <ToDoComponent />
        },
        {
            path: "todo",
            title: "Users",
            element: <UsersComponent />
        },
        {
            path: "product",
            title: "Products",
            element: <ProductComponent />
        },
        {
            path: "transaction",
            title: "Transactions",
            element: <TransactionComponent />
        },
        {
            path: "*",
            element: <NotFoundComponent />
        },
    ]
}