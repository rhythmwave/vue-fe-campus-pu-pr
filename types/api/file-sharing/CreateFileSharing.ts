import { MetaModel } from "../meta"

export interface CreateFileSharingRoot {
    meta: MetaModel
    data: any
}

export interface CreateFileSharingRequest {
    title: string
    file_path: string
    file_path_type: string
    remarks: string
}