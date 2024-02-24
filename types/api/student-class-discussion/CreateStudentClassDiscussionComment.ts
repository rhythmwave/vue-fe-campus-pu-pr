import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentClassDiscussionCommentRequest {
    class_discussion_id: string
    comment: string
}
  

export interface CreateStudentClassDiscussionCommentRoot {
    meta: MetaModel
    data: any
}

