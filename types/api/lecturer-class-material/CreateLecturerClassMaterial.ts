import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerClassMaterialRequest {
    class_id: string
    title: string
    abstraction: string
    file_path: string
    file_path_type: string
    is_active: boolean
}
  

export interface CreateLecturerClassMaterialRoot {
    meta: MetaModel
    data: any
}

