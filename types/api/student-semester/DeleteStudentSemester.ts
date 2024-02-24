import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentSemesterRequest {
    id: string
}
  

export interface DeleteStudentSemesterRoot {
    meta: MetaModel
    data: any
}
