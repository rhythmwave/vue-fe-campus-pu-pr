import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerClassEventDetailRoot {
    meta: MetaModel
    data: GetLecturerClassEventDetailData
}

export interface GetLecturerClassEventDetailData {
    id: string,
    name: string,
    age: number,
}
