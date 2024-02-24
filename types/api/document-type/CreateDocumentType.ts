import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateDocumentTypeRequest {
    name: string
}
  

export interface CreateDocumentTypeRoot {
    meta: MetaModel
    data: any
}

