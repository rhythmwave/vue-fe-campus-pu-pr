import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentClassDiscussionDetailRoot {
    meta: MetaModel
    data: GetStudentClassDiscussionDetailData
}

export interface GetStudentClassDiscussionDetailData {
    id: string,
    name: string,
    age: number,
}
