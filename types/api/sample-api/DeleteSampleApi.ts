import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteSampleApiRequest {
    id: string
}
  

export interface DeleteSampleApiRoot {
    meta: MetaModel
    data: any
}
