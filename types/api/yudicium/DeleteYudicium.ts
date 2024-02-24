import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteYudiciumRequest {
    id: string
}
  

export interface DeleteYudiciumRoot {
    meta: MetaModel
    data: any
}
