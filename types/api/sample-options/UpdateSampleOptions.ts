import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateSampleOptionsRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateSampleOptionsRoot {
    meta: MetaModel
    data: any
}
