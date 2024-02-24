import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateDocumentActionRequest {
    action: string
    english_action: string
}



export interface CreateDocumentActionRoot {
    meta: MetaModel
    data: any
}

