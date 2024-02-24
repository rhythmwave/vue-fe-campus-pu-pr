import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetGraduationSessionDetailRoot {
    meta: MetaModel
    data: GetGraduationSessionDetailData
}

export interface GetGraduationSessionDetailData {
    id: string,
    name: string,
    age: number,
}
