import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentStudentLeaveDetailRoot {
    meta: MetaModel
    data: GetStudentStudentLeaveDetailData
}

export interface GetStudentStudentLeaveDetailData {
    id: string,
    name: string,
    age: number,
}
