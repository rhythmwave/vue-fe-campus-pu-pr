import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentClassMaterialListRequest {
    name: string
}


export interface GetStudentClassMaterialListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentClassMaterialListData[]
}

export interface GetStudentClassMaterialListData {
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
    created_at: string
}