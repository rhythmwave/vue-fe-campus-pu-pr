import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteOfficerRequest {
    id: string
}
  

export interface DeleteOfficerRoot {
    meta: MetaModel
    data: any
}
