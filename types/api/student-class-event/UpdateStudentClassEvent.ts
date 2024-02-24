import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentClassEventRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentClassEventRoot {
    meta: MetaModel
    data: any
}
