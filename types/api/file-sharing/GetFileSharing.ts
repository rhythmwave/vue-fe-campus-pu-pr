import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetFileSharingRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetFileSharingData[]
}

export interface GetFileSharingData {
    id: string
    title: string
    file_path: string
    file_path_type: string
    remarks: string
    lecturer_id: string
    lecturer_front_title: string
    lecturer_name: string
    lecturer_back_degree: string
    file_url: string
    created_at: string
    is_approved: boolean
}