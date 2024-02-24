import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerClassExamListRequest {
    name: string
}
  

export interface GetLecturerClassExamListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerClassExamListData[]
}

export interface GetLecturerClassExamListData {
    id: string
    title: string
    abstraction: string
    file_url: string
    file_path: string
    file_path_type: string
    lecturer_id: string
    lecturer_name: string
    lecturer_front_title: string
    lecturer_back_degree: string
    start_time: string
    end_time: string
    total_submission: number
}