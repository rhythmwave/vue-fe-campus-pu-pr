import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentClassMaterialRequest {
    id: string
}
  

export interface DeleteStudentClassMaterialRoot {
    meta: MetaModel
    data: any
}
