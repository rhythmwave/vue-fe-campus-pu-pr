import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentClassWorkListRequest {
    name: string
}
  

export interface GetStudentClassWorkListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentClassWorkListData[]
}

export interface GetStudentClassWorkListData {
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
    submission_file_url: string
    submission_file_path: string
    submission_file_path_type: string
    submission_point: number
}