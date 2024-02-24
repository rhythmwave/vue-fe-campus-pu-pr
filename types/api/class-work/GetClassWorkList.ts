import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetClassWorkListRequest {
    name: string
}
  

export interface GetClassWorkListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetClassWorkListData[]
}

export interface GetClassWorkListData {
    id: string
    title: string
    abstraction: string
    file_url: string
    lecturer_id: string
    lecturer_name: string
    lecturer_front_title: string
    lecturer_back_degree: string
    start_time: string
    end_time: string
    total_submission: number
}