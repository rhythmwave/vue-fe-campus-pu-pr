import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentClassWorkDetailRoot {
    meta: MetaModel
    data: GetStudentClassWorkDetailData
}

export interface GetStudentClassWorkDetailData {
    id: string,
    name: string,
    age: number,
}
