import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentClassWorkRequest {
    name: string
    age: number
}
  

export interface CreateStudentClassWorkRoot {
    meta: MetaModel
    data: any
}

