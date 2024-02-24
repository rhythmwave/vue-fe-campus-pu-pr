import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLecturerClassRequest {
    id: string
}
  

export interface DeleteLecturerClassRoot {
    meta: MetaModel
    data: any
}
