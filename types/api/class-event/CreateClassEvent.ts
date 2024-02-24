import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateClassEventRequest {
    name: string
    age: number
}
  

export interface CreateClassEventRoot {
    meta: MetaModel
    data: any
}

