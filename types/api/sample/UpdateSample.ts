import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateSampleRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateSampleRoot {
    meta: MetaModel
    data: any
}
