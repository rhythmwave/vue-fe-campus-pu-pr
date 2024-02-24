import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentActivityRequest {
    id: string
}
  

export interface DeleteStudentActivityRoot {
    meta: MetaModel
    data: any
}
