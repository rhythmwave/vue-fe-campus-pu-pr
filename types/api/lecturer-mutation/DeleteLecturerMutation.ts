import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLecturerMutationRequest {
    id: string
}
  

export interface DeleteLecturerMutationRoot {
    meta: MetaModel
    data: any
}
