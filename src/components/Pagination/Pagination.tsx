type PaginationProps = {
    currentPage: number;
    onPageChange: (page: number) => void;
    totalPages: number;
};

export function Pagination({
    currentPage,
    onPageChange,
    totalPages,
}: PaginationProps) {
    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                className="pagination__button"
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous page
            </button>
            <p className="pagination__status">
                Page {currentPage} of {totalPages}
            </p>
            <button
                className="pagination__button"
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next page
            </button>
        </nav>
    );
}
