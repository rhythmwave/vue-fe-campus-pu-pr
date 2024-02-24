import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateClassMaterialRequest {
    class_id: string
    title: string
    abstraction: string
    file_path: string
    file_path_type: string
    is_active: boolean
}

export interface CreateClassMaterialRoot {
    meta: MetaModel
    data: any
}