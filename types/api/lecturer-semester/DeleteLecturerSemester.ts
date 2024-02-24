import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLecturerSemesterRequest {
    id: string
}
  

export interface DeleteLecturerSemesterRoot {
    meta: MetaModel
    data: any
}
