import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerSemesterDetailRoot {
    meta: MetaModel
    data: GetLecturerSemesterDetailData
}

export interface GetLecturerSemesterDetailData {
    id: string,
    name: string,
    age: number,
}
