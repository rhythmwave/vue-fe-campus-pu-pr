import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteFileRequest {
    id: string
}
  

export interface DeleteFileRoot {
    meta: MetaModel
    data: any
}
