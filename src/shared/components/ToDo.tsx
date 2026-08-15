import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "../hooks/debounce";
import InputComponent from "./SimpleInput";
import { usePagination } from "../hooks/pagination";
import PaginationComponent from "./Pagination";
import SearchComponent from "./Search";
import DatePickerComponent from "./DatePicker";

export default function ToDoComponent() {
    const [data, setData] = useState(() => {
        const savedTodos = localStorage.getItem("todos");
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [filterData, setFilterData] = useState([]);
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)

    const [formData, setFormData] = useState({
        id: null,
        name: "",
        completed: false,
    })

    const [listId, setListId] = useState<any>([])
    const [date, setDate] = useState("");

    const debounceInput = useDebounce(search, 1000);

    const {
        currentPage,
        totalPages,
        currentItems,
        nextPage,
        prevPage,
        goToPage,
        hasPrev,
        hasNext,
    } = usePagination(filterData, 5); // 5 items per page

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        // Validasi
        if (!formData.name.trim()) return;

        setLoading(true)

        // UPDATE
        if (formData.id !== null) {
            setData(
                data.map((todo: any) =>
                    todo.id === formData.id
                        ? {
                            ...todo,
                            name: formData.name.trim(),
                        }
                        : todo
                )
            );
            setSuccess(true)
        }

        // CREATE
        else {
            const newTodo = {
                id: Date.now(),
                name: formData.name.trim(),
                completed: false,
            };

            setData([...data, newTodo]);
            setSuccess(true)
        }

        // Reset form
        setFormData({
            id: null,
            name: "",
            completed: false,
        });


        const timeOut = setTimeout(() => {
            setSuccess(false)
            setLoading(false)
        }, 1000)

        return () => clearTimeout(timeOut)
    };

    const handleEdit = (todo: any) => {
        setFormData({
            id: todo.id,
            name: todo.name,
            completed: todo.completed,
        });
    };

    // UPDATE status completed
    const toggleTodo = (id: any) => {
        setData((prev: any[]) => {
            const updatedData = prev.map((todo: any) =>
                todo.id === id
                    ? {
                        ...todo,
                        completed: !todo.completed,
                    }
                    : todo
            );

            setListId(
                updatedData
                    .filter((todo: any) => todo.completed)
                    .map((todo: any) => todo.id)
            );

            return updatedData;
        });
    };

    // DELETE
    const handleDelete = (id: any) => {
        setData(data?.filter((prev: any) => prev?.id !== id))
    };

    // SORTING
    const handleSorting = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const direction = e?.target.value;

        const sortedData = [...data].sort((a: any, b: any) => {
            if (direction === "asc") {
                return a.name.localeCompare(b.name);
            }

            return b.name.localeCompare(a.name);
        });

        setData(sortedData);
    };

    // DELETE MULTIPLE DATA
    const handleDeleteMultiple = () => {
        setData((prev: any[]) =>
            prev.filter((todo: any) => !listId.includes(todo.id))
        );

        setListId([]);
    };

    // Cancel edit
    const handleCancel = () => {
        setFormData({
            id: null,
            name: "",
            completed: false,
        });
    };

    const getFilterData = () => {
        try {
            setLoading(true)
            const result = data?.filter((result: any) => result?.name?.toLowerCase().includes(debounceInput))
            setFilterData(result)
        } finally {
            setLoading(false)
        }
    }

    const cardList = (data: any, isCompleted = false) => {
        return (
            <>
                {Array.isArray(data) && data?.map((result: any) => (
                    <div style={{
                        display: "flex",
                        gap: "10px",
                        width: "100%"
                    }} key={result?.id}>
                        <div className="simple-card" style={{
                            backgroundColor: result?.completed && !isCompleted ? "rgb(239, 241, 255)" : "white",
                            border: `1px solid ${result?.completed && !isCompleted ? "rgb(38, 53, 165)" : "white"}`,
                            width: "100%",
                            cursor: isCompleted ? "default" : "pointer"
                        }} key={result?.id} onClick={() => !isCompleted && toggleTodo(result?.id)}>
                            <span
                                className={result.completed ? "completed" : ""}
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start"
                                }}
                            >
                                {result.name}
                            </span>
                        </div>
                        {!isCompleted && (
                            <div style={{ display: "flex", gap: "5px" }}>
                                <button className="simple-button blue-color" onClick={() => handleEdit(result)}>
                                    Edit
                                </button>
                                <button className="simple-button red-color" onClick={() => handleDelete(result.id)}>
                                    Hapus
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </>
        )
    }

    const dropdownElement = () => {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "5px"
            }}>
                <h4 style={{
                    fontSize: "16px",
                    fontWeight: "400"
                }}>Sort By:</h4>
                <select
                    name="direction"
                    id="direction"
                    style={{
                        backgroundColor: "transparent",
                        color: "black",
                        padding: "5px 10px",
                        borderRadius: "5px"
                    }}
                    onChange={handleSorting}
                >
                    <option defaultValue="" disabled>Sorting</option>
                    <option value="asc">A - Z</option>
                    <option value="desc">Z - A</option>
                </select>
            </div>
        )
    }

    const completedTask = [...data]?.filter((todo) => Boolean(todo?.completed))

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(data))
        const updateData = data
            .filter((todo: any) => todo.completed)
            .map((todo: any) => todo.id)

        setListId(updateData)
    }, [data])

    useEffect(() => { getFilterData() }, [debounceInput, data])

    return (
        <div>
            <div style={{
                display: "flex",
                gap: "10px",
            }}>
                <InputComponent
                    inputId='todo'
                    inputName="name"
                    labelName='ToDo'
                    inputType='text'
                    inputValue={formData?.name}
                    onChange={handleChange}
                />
                <div style={{
                    display: "flex",
                    gap: "5px",
                    width: "50%",
                    height: "100%",
                    marginTop: "auto"
                }}>
                    <button
                        onClick={handleSubmit}
                        className="big-button"
                        style={{
                            backgroundColor: formData?.name !== "" ? "rgb(120, 120, 120)" : "rgb(120, 120, 120, 0.6)"
                        }}
                        disabled={formData?.name === ""}
                    >
                        {formData?.id ? "Ubah" : "Tambah"}
                    </button>
                    {formData.id !== null && (
                        <button
                            onClick={handleCancel}
                            className="big-button" style={{
                                backgroundColor: formData?.name !== "" ? "rgb(120, 120, 120)" : "rgb(120, 120, 120, 0.6)"
                            }}>
                            Batal
                        </button>
                    )}
                </div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
                marginTop: "30px",
                width: "100%",
            }}>
                {success && (
                    <div className="alert border-green light-green-color">
                        Data Berhasil Ditambahkan
                    </div>
                )}
                <SearchComponent
                    inputId='search'
                    inputName='search'
                    labelName='Search Users'
                    inputType='text'
                    inputValue={search || ""}
                    onChange={(value: any) => setSearch(value)}
                />
                {/* <DatePickerComponent
                    label="Tanggal lahir"
                    value={date}
                    onChange={(newDate: any) => setDate(newDate)}
                    required
                /> */}
                {dropdownElement()}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    marginTop: "10px",
                    width: "100%"
                }}>
                    <h3 style={{ marginTop: "10px" }}>Result: {filterData?.length} ToDo</h3>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}>{listId?.length > 0 ? (
                        <>
                            <span style={{
                                fontWeight: "600"
                            }}>Selected: {listId?.length} Items</span>
                            <button onClick={handleDeleteMultiple} style={{
                                color: "red",
                                padding: 0,
                                border: "none",
                                outline: "none",
                                backgroundColor: "transparent",
                                cursor: "pointer"
                            }}>Delete</button>
                        </>
                    ) : null}
                    </div>
                </div>
                {loading && <span>tunggu dulu...</span>}
                {!loading && filterData?.length === 0 && <span>Yah, datanya gak ada...</span>}
                {!loading && filterData?.length > 0 && (
                    <Suspense fallback={<span>loading element</span>}>
                        {cardList(filterData)}
                    </Suspense>
                )}
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
                marginTop: "30px",
                width: "100%",
            }}>
                <h3>Task Completed: {completedTask?.length || 0}</h3>
                {completedTask?.length > 0 && cardList(completedTask, true)}
            </div>



            {/* {!loading && filterData?.length !== 0 && (
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    currentItems={filterData}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    goToPage={goToPage}
                    hasPrev={hasPrev}
                    hasNext={hasNext}
                />
            )} */}
        </div>
    )
}