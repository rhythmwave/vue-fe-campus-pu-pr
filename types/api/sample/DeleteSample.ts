import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteSampleRequest {
    id: string
}
  

export interface DeleteSampleRoot {
    meta: MetaModel
    data: any
}
