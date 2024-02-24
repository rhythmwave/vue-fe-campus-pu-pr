import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentSkpiRequest {
    name: string
    age: number
}
  

export interface CreateStudentSkpiRoot {
    meta: MetaModel
    data: any
}

