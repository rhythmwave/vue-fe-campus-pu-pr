import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteMajorRequest {
    id: string
}
  

export interface DeleteMajorRoot {
    meta: MetaModel
    data: any
}
