import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLecturerRequest {
    id: string
}
  

export interface DeleteLecturerRoot {
    meta: MetaModel
    data: any
}
