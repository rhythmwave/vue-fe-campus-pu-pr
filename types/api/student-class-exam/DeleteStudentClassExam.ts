import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentClassExamRequest {
    id: string
}
  

export interface DeleteStudentClassExamRoot {
    meta: MetaModel
    data: any
}
