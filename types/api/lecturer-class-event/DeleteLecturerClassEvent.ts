import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLecturerClassEventRequest {
    id: string
}
  

export interface DeleteLecturerClassEventRoot {
    meta: MetaModel
    data: any
}
