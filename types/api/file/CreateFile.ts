import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateFileRequest {
    file: string
}


export interface CreateFileRoot {
    meta: MetaModel
    data: CreateFileData
}

export interface CreateFileData {
    path: string
    mime_type: string
    size: number
    url: string
    path_type: string
}