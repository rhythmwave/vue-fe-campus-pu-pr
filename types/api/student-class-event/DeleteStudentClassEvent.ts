import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentClassEventRequest {
    id: string
}
  

export interface DeleteStudentClassEventRoot {
    meta: MetaModel
    data: any
}
