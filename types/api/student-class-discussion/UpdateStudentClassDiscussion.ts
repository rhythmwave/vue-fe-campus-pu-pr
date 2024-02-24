import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentClassDiscussionRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentClassDiscussionRoot {
    meta: MetaModel
    data: any
}
