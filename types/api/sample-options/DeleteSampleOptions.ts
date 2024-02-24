import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteSampleOptionsRequest {
    id: string
}
  

export interface DeleteSampleOptionsRoot {
    meta: MetaModel
    data: any
}
