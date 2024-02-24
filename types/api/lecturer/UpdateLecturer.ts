import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateLecturerRoot {
    meta: MetaModel
    data: any
}
