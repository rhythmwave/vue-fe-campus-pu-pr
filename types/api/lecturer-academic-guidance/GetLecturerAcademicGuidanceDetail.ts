import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerAcademicGuidanceDetailRoot {
    meta: MetaModel
    data: GetLecturerAcademicGuidanceDetailData
}

export interface GetLecturerAcademicGuidanceDetailData {
    id: string,
    name: string,
    age: number,
}
