import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentClassExamDetailRoot {
    meta: MetaModel
    data: GetStudentClassExamDetailData
}

export interface GetStudentClassExamDetailData {
    id: string,
    name: string,
    age: number,
}
