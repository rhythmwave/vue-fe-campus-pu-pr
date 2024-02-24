import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentClassDiscussionRequest {
    name: string
    age: number
}
  

export interface CreateStudentClassDiscussionRoot {
    meta: MetaModel
    data: any
}

