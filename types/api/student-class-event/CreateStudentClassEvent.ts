import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentClassEventRequest {
    name: string
    age: number
}
  

export interface CreateStudentClassEventRoot {
    meta: MetaModel
    data: any
}

