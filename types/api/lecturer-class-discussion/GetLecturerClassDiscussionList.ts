import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerClassDiscussionListRequest {
    name: string
}
  

export interface GetLecturerClassDiscussionListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerClassDiscussionListData[]
}

export interface GetLecturerClassDiscussionListData {
    id: string
    title: string
    abstraction: string
    lecturer_id: string
    lecturer_name: string
    lecturer_front_title: string
    lecturer_back_degree: string
    total_comment: number
    last_comment: string
}