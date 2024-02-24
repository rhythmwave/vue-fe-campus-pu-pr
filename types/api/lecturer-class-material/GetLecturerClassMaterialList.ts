import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerClassMaterialListRequest {
    name: string
}
  

export interface GetLecturerClassMaterialListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerClassMaterialListData[]
}

export interface GetLecturerClassMaterialListData {
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
    created_at: string
}