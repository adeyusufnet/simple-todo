interface PaginationProps {
    prevPage: () => void,
    nextPage: () => void,
    goToPage: () => void,
    hasPrev: boolean,
    hasNext: boolean,
    currentPage: number,
    totalPages: number,
}

export default function PaginationComponent({ prevPage, nextPage, goToPage, hasPrev, hasNext, currentPage, totalPages }: PaginationProps) {
    return (
        <div style={{
            display: "flex", justifyContent: "center", flexDirection: "row-reverse"
        }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
                <button className="simple-button" onClick={prevPage} disabled={!hasPrev}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button className="simple-button" onClick={nextPage} disabled={!hasNext}>
                    Next
                </button>
            </div>

            {/* Quick Jump Direct Buttons */}
            {/* <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page: any) => (
                    <button
                        key={page}
                        onClick={() => goToPage()}
                        style={{ fontWeight: currentPage === page ? 'bold' : 'normal', background: "none", outline: "none", border: "none", color: "black" }}
                    >
                        {page}
                    </button>
                ))}
            </div> */}
        </div>
    )
}