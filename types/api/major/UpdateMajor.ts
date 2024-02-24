import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateMajorRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateMajorRoot {
    meta: MetaModel
    data: any
}
