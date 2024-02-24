import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetDocumentActionDetailRoot {
    meta: MetaModel
    data: GetDocumentActionDetaiData
}

export interface GetDocumentActionDetaiData {
    id: string
    action: string
    english_action: string
}
