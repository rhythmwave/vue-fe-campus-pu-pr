import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateYudiciumRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateYudiciumRoot {
    meta: MetaModel
    data: any
}
