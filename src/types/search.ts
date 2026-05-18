export type SearchResultItem = {
    id: string;
    name: string;
    url?: string;
};

export type SearchResultsPage = {
    items: SearchResultItem[];
    page: number;
    totalPages: number;
};
