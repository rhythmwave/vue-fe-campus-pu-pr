import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerClassDiscussionRequest {
    class_id: string
    title: string
    abstraction: string
}
  

export interface CreateLecturerClassDiscussionRoot {
    meta: MetaModel
    data: any
}

