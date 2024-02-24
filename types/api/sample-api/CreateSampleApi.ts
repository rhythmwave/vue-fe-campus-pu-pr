import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateSampleApiRequest {
    name: string
    age: number
}
  

export interface CreateSampleApiRoot {
    meta: MetaModel
    data: any
}

