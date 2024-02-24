import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetClassMaterialRoot {
    meta: MetaModel
    data: GetClassMaterialData[]
}

export interface GetClassMaterialData {
    id: string
    title: string
    abstraction: string
    file_path: string
    file_path_type: string
    file_url: string
    lecturer_id: string
    lecturer_name: string
    lecturer_front_title: string
    lecturer_back_degree: string
    is_active: boolean
}
