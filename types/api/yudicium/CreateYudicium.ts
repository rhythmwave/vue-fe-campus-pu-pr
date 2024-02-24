import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateYudiciumRequest {
    name: string
    age: number
}
  

export interface CreateYudiciumRoot {
    meta: MetaModel
    data: any
}

