import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateSampleApiRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateSampleApiRoot {
    meta: MetaModel
    data: any
}
