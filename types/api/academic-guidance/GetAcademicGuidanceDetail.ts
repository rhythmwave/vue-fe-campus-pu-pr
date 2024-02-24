import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetAcademicGuidanceDetailRoot {
    meta: MetaModel
    data: GetAcademicGuidanceDetailData
}

export interface GetAcademicGuidanceDetailData {
    id: string,
    name: string,
    age: number,
}
