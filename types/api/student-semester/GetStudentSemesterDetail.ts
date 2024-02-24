import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentSemesterDetailRoot {
    meta: MetaModel
    data: GetStudentSemesterDetailData
}

export interface GetStudentSemesterDetailData {
    id: string,
    name: string,
    age: number,
}
