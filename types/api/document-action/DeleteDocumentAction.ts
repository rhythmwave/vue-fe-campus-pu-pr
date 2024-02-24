import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteDocumentActionRequest {
    id: string
}
  

export interface DeleteDocumentActionRoot {
    meta: MetaModel
    data: any
}
