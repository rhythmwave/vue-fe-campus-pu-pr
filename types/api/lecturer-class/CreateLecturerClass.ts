import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerClassRequest {
    name: string
    age: number
}
  

export interface CreateLecturerClassRoot {
    meta: MetaModel
    data: any
}

