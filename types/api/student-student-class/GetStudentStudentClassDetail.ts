import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentStudentClassDetailRoot {
    meta: MetaModel
    data: GetStudentStudentClassDetailData
}

export interface GetStudentStudentClassDetailData {
    id: string,
    name: string,
    age: number,
}
