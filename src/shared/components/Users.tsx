import { useEffect, useState } from "react";
import SearchComponent from "./Search"
import { useDebounce } from "../hooks/debounce";
import { fetchData } from "../hooks/fetch";
import SimpleListCardComponent from "./SimpleListCard";
import { usePagination } from "../hooks/pagination";

export default function UsersComponent() {
    // const { name } = useContentStore()
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any>([]);
    const [filterData, setFilterData] = useState<any>([])
    const [search, setSearch] = useState<any>("");

    const debounceInput = useDebounce(search, 1000)
    // const debounceInput = useThrottle(search, 2000)

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

    const getData = async () => {
        setLoading(true)

        // const url = `https://master-pam.logi-chain.com/api/customer/country?search=${search}`
        const url = "../../../public/dummy/dummy-data.json"

        try {
            const result: any = await fetchData(url);

            setData(result?.users)
            setLoading(false)
        } catch (err) {
            console.log(err);
            setLoading(false)
        }
    };

    const getFilterData = () => {
        try {
            setLoading(true)
            const result = data?.filter((result: any) => result?.nama?.toLowerCase().includes(debounceInput))
            setFilterData(result)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { getData() }, []);
    useEffect(() => { getFilterData() }, [debounceInput, data])

    return (
        <div className="halo">
            <SearchComponent
                inputId='search'
                inputName='search'
                labelName='Search Users'
                inputType='text'
                inputValue={search || ""}
                onChange={(value: any) => setSearch(value)}
            />
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "30px"
            }}>
                {loading && (
                    <span>tunggu dulu...</span>
                )}
                <h3>Result: {filterData?.length} User</h3>
                {!loading && filterData?.length === 0 && (
                    <span>Yah, datanya gak ada...</span>
                )}
                {!loading && filterData?.length > 0 && (
                    <SimpleListCardComponent data={currentItems} />
                )}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
                <button onClick={prevPage} disabled={!hasPrev}>
                    Previous
                </button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button onClick={nextPage} disabled={!hasNext}>
                    Next
                </button>
            </div>

            {/* Quick Jump Direct Buttons */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        style={{ fontWeight: currentPage === page ? 'bold' : 'normal' }}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    )
}