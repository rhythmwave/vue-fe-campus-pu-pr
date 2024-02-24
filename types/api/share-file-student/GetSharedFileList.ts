import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetSharedFileListRoot {
    meta: MetaModel
    data: GetSharedFileListData[]
}

export interface GetSharedFileListData {
    id: string
    lecturer_id: string
    lecturer_name: string
    lecturer_front_title: string
    lecturer_back_degree: string
    title: string
    file_url: string
    remarks: string
    created_at: string
}
