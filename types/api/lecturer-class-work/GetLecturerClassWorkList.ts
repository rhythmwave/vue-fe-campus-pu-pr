import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerClassWorkListRequest {
    name: string
}
  

export interface GetLecturerClassWorkListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerClassWorkListData[]
}

export interface GetLecturerClassWorkListData {
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