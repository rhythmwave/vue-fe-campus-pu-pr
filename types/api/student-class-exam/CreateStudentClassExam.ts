import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentClassExamRequest {
    name: string
    age: number
}
  

export interface CreateStudentClassExamRoot {
    meta: MetaModel
    data: any
}

