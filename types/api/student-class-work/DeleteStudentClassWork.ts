import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentClassWorkRequest {
    id: string
}
  

export interface DeleteStudentClassWorkRoot {
    meta: MetaModel
    data: any
}
