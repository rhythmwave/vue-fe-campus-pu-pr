import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetGraduationDetailRoot {
    meta: MetaModel
    data: GetGraduationDetailData
}

export interface GetGraduationDetailData {
    id: string,
    name: string,
    age: number,
}
