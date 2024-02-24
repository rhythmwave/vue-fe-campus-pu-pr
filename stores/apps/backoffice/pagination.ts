
export interface Pagination {
    page: number,
    limit: number,
    prev: number,
    next: number,
    total_pages: number,
    total_records: number,
}

export interface Meta {
    message: string,
    status: number,
    code: number,
}

