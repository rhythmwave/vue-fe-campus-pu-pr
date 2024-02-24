import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteDocumentTypeRequest {
    id: string
}
  

export interface DeleteDocumentTypeRoot {
    meta: MetaModel
    data: any
}
