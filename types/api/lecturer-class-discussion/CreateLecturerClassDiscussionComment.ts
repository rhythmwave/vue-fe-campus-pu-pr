import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerClassDiscussionCommentRequest {
    class_discussion_id: string
    comment: string
}
  

export interface CreateLecturerClassDiscussionCommentRoot {
    meta: MetaModel
    data: any
}

