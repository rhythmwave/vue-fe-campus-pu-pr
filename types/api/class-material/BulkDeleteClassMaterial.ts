import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface BulkDeleteClassMaterialRequest {
    ids: string[]
}

export interface BulkDeleteClassMaterialRoot {
    meta: MetaModel
    data: any
}

