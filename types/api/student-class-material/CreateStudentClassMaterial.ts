import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentClassMaterialRequest {
    name: string
    age: number
}
  

export interface CreateStudentClassMaterialRoot {
    meta: MetaModel
    data: any
}

