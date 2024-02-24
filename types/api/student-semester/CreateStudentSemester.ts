import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentSemesterRequest {
    name: string
    age: number
}
  

export interface CreateStudentSemesterRoot {
    meta: MetaModel
    data: any
}

