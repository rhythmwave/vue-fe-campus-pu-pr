import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentClassEventDetailRoot {
    meta: MetaModel
    data: GetStudentClassEventDetailData
}

export interface GetStudentClassEventDetailData {
    id: string,
    name: string,
    age: number,
}
