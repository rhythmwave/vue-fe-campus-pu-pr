import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLecturerClassWorkRequest {
    id: string
}
  

export interface DeleteLecturerClassWorkRoot {
    meta: MetaModel
    data: any
}
