import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentSemesterRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentSemesterRoot {
    meta: MetaModel
    data: any
}
