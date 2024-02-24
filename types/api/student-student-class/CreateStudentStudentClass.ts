import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentStudentClassRequest {
    name: string
    age: number
}
  

export interface CreateStudentStudentClassRoot {
    meta: MetaModel
    data: any
}

