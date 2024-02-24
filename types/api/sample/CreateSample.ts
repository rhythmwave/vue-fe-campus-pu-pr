import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateSampleRequest {
    name: string
    age: number
}
  

export interface CreateSampleRoot {
    meta: MetaModel
    data: any
}

