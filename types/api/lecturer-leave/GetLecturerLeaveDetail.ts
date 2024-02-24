import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerLeaveDetailRoot {
    meta: MetaModel
    data: GetLecturerLeaveDetailData
}

export interface GetLecturerLeaveDetailData {
    id: string,
    name: string,
    age: number,
}
