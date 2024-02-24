import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerClassGradeComponentDetailRoot {
    meta: MetaModel
    data: GetLecturerClassGradeComponentDetailData
}

export interface GetLecturerClassGradeComponentDetailData {
    id: string,
    name: string,
    age: number,
}
