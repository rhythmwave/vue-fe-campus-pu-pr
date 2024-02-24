import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetDocumentTypeDetailRoot {
    meta: MetaModel
    data: GetDocumentTypeDetaiData
}

export interface GetDocumentTypeDetaiData {
    id: string,
    name: string,
}
