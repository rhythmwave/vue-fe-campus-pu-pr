import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateDocumentActionRequest {
    id: string
    action: string
    english_action: string
}

export interface UpdateDocumentActionRoot {
    meta: MetaModel
    data: any
}
