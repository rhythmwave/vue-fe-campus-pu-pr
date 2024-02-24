import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteSemesterRequest {
    id: string
}
  

export interface DeleteSemesterRoot {
    meta: MetaModel
    data: any
}
