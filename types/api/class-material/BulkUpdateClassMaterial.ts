import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface BulkUpdateClassMaterialRequest {
    ids: string[]
    is_active: boolean
}

export interface BulkDeleteClassMaterialRequest {
    ids: string[]
}

export interface BulkUpdateClassMaterialRoot {
    meta: MetaModel
    data: any
}

