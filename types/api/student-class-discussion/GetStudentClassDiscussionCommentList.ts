import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentClassDiscussionCommentListRequest {
    name: string
}
  

export interface GetStudentClassDiscussionCommentListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentClassDiscussionCommentListData[]
}

export interface GetStudentClassDiscussionCommentListData {
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