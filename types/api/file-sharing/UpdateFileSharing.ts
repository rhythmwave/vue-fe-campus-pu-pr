import { MetaModel } from "../meta"

export interface UpdateFileSharingRoot {
    meta: MetaModel
    data: any
}

export interface UpdateFileSharingRequest {
    id: string
    title: string
    file_path: string
    file_path_type: string
    file_url: string
    remarks: string
}