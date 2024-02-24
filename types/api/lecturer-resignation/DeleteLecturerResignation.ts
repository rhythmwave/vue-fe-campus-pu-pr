import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLecturerResignationRequest {
    id: string
}
  

export interface DeleteLecturerResignationRoot {
    meta: MetaModel
    data: any
}
