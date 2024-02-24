import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateFileRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateFileRoot {
    meta: MetaModel
    data: any
}
