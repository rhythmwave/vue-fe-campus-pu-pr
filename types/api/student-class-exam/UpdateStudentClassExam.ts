import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentClassExamRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentClassExamRoot {
    meta: MetaModel
    data: any
}
