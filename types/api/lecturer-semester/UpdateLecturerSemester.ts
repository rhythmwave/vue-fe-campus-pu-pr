import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerSemesterRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateLecturerSemesterRoot {
    meta: MetaModel
    data: any
}
