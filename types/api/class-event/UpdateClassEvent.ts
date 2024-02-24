import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateClassEventRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateClassEventRoot {
    meta: MetaModel
    data: any
}
