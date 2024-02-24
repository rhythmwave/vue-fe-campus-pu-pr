import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentSkpiRequest {
    id: string
}
  

export interface DeleteStudentSkpiRoot {
    meta: MetaModel
    data: any
}
