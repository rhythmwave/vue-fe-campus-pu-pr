import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerSemesterRequest {
    name: string
    age: number
}
  

export interface CreateLecturerSemesterRoot {
    meta: MetaModel
    data: any
}

