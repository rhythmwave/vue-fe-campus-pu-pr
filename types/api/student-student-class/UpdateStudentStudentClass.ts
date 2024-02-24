import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentStudentClassRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentStudentClassRoot {
    meta: MetaModel
    data: any
}
