import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentClassEventListRequest {
    name: string
}
  

export interface GetStudentClassEventListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentClassEventListData[]
}

export interface GetStudentClassEventListData {
    id: string
    title: string
    frequency: string
    event_time: string
    lecturer_id: string
    lecturer_name: string
    lecturer_front_title: string
    lecturer_back_degree: string
    remarks: string
    is_active: boolean
    created_at: string
}