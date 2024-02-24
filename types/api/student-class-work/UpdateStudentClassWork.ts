import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentClassWorkRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentClassWorkRoot {
    meta: MetaModel
    data: any
}
