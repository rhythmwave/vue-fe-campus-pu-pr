import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteClassEventRequest {
    id: string
}
  

export interface DeleteClassEventRoot {
    meta: MetaModel
    data: any
}
