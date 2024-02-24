import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateSampleOptionsRequest {
    name: string
    age: number
}
  

export interface CreateSampleOptionsRoot {
    meta: MetaModel
    data: any
}

