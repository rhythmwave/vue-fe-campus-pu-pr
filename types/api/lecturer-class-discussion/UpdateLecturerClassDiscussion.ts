import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerClassDiscussionRequest {
    id: string
    title: string
    abstraction: string
}
  

export interface UpdateLecturerClassDiscussionRoot {
    meta: MetaModel
    data: any
}
