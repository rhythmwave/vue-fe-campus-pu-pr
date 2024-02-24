import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerClassExamDetailRoot {
    meta: MetaModel
    data: GetLecturerClassExamDetailData
}

export interface GetLecturerClassExamDetailData {
    id: string,
    name: string,
    age: number,
}
