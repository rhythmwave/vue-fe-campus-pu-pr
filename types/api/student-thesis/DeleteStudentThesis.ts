import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentThesisRequest {
    id: string
}
  

export interface DeleteStudentThesisRoot {
    meta: MetaModel
    data: any
}
