import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateDocumentTypeRequest {
    id: string
    name: string
}
  

export interface UpdateDocumentTypeRoot {
    meta: MetaModel
    data: any
}
