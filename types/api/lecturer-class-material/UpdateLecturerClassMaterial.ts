import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerClassMaterialRequest {
    id: string
    title: string
    abstraction: string
    file_path: string
    file_path_type: string
    is_active: boolean
}
  

export interface UpdateLecturerClassMaterialRoot {
    meta: MetaModel
    data: any
}
