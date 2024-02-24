import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteClassWorkRequest {
    id: string
}
  

export interface DeleteClassWorkRoot {
    meta: MetaModel
    data: any
}
