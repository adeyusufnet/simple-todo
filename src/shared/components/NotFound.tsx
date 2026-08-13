import { useEffect, useState } from "react";
import { useContentStore } from "../store/contentStore"
import SearchComponent from "./Search"
import { useDebounce } from "../hooks/debounce";
import { fetchData } from "../hooks/fetch";
import SimpleListCardComponent from "./SimpleListCard";

export default function NotFoundComponent() {
    // const { name } = useContentStore()

    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any>([]);
    const [filterData, setFilterData] = useState<any>([])
    const [search, setSearch] = useState<any>("");

    const debounceInput = useDebounce(search, 2000)

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
            const result = data?.filter((result: any) => result?.nama?.toLowerCase().includes(debounceInput));

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
                labelName='Search Country'
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
                <h3>Result: {filterData?.length}</h3>
                {!loading && filterData?.length === 0 && (
                    <span>Yah, datanya gak ada...</span>
                )}
                {!loading && filterData?.length > 0 && (
                    <SimpleListCardComponent data={filterData} />
                )}
            </div>
        </div>
    )
}