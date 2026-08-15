import { Routes, Route } from "react-router-dom";
import HomepageComponent from "./Home";
import { ListRoutes } from "../utils/ListRoutes";
import { Suspense } from "react";
import LoadingComponent from "./Loading";
import ToDoComponent from "./ToDo";

export default function NavigationComponent() {
    return (
        <Routes>
            <Route path="/" element={<ToDoComponent />} />
            {Array?.isArray(ListRoutes()) && ListRoutes()?.map((route, index) => {
                return (
                    <Route
                        index
                        key={route.path + index}
                        path={route.path}
                        element={
                            <Suspense fallback={<LoadingComponent />}>
                                {route?.element}
                            </Suspense>
                        }
                    />
                )
            })}
        </Routes>
    )
}