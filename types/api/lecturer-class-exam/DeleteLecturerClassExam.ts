import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLecturerClassExamRequest {
    ids: string[]
}
  

export interface DeleteLecturerClassExamRoot {
    meta: MetaModel
    data: any
}
