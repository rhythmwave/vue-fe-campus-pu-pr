import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerResignationDetailRoot {
    meta: MetaModel
    data: GetLecturerResignationDetailData
}

export interface GetLecturerResignationDetailData {
    id: string,
    name: string,
    age: number,
}
