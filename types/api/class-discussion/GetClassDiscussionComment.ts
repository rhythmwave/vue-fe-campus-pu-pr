import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetClassDiscussionCommentRequest {
    name: string
}
  

export interface GetClassDiscussionCommentRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetClassDiscussionCommentData[]
}

export interface GetClassDiscussionCommentData {
    id: string
    student_id: string
    student_nim_number: string
    student_name: string
    lecturer_id: string
    lecturer_name: string
    lecturer_front_title: string
    lecturer_back_degree: string
    comment: string
}