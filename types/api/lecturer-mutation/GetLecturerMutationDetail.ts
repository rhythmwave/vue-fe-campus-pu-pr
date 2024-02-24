import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerMutationDetailRoot {
    meta: MetaModel
    data: GetLecturerMutationDetailData
}

export interface GetLecturerMutationDetailData {
    id: string,
    name: string,
    age: number,
}
