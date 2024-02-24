import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentSkpiRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentSkpiRoot {
    meta: MetaModel
    data: any
}
