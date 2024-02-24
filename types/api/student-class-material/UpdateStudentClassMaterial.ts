import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentClassMaterialRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentClassMaterialRoot {
    meta: MetaModel
    data: any
}
