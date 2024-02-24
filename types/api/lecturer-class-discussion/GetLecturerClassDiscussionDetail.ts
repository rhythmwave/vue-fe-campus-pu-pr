import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerClassDiscussionDetailRoot {
    meta: MetaModel
    data: GetLecturerClassDiscussionDetailData
}

export interface GetLecturerClassDiscussionDetailData {
    id: string,
    name: string,
    age: number,
}
