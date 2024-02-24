import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteOfficerActionRequest {
    id: string
}
  

export interface DeleteOfficerActionRoot {
    meta: MetaModel
    data: any
}
