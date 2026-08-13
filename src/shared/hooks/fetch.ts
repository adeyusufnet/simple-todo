export const fetchData = async (url: any) => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response?.ok) {
            throw new Error("Soemthing wrong")
        }

        return await response?.json();
    } catch (error) {
        console.log(`Something weht wrong: ${error}`)
    }
}