import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLaboratoryRequest {
    id: string
}
  

export interface DeleteLaboratoryRoot {
    meta: MetaModel
    data: any
}
