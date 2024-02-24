import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerClassDiscussionCommentListRequest {
    name: string
}
  

export interface GetLecturerClassDiscussionCommentListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerClassDiscussionCommentListData[]
}

export interface GetLecturerClassDiscussionCommentListData {
    id: string
    student_id: string
    student_nim_number: string
    student_name: string
    lecturer_id: string
    lecturer_name: string
    lecturer_front_title: string
    lecturer_back_degree: string
    comment: string
    self_comment: boolean
}