import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerClassRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateLecturerClassRoot {
    meta: MetaModel
    data: any
}
