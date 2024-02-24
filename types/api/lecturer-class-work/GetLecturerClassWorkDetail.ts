import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerClassWorkDetailRoot {
    meta: MetaModel
    data: GetLecturerClassWorkDetailData
}

export interface GetLecturerClassWorkDetailData {
    id: string,
    name: string,
    age: number,
}
