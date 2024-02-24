import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetClassGradeComponentDetailRoot {
    meta: MetaModel
    data: GetClassGradeComponentDetailData
}

export interface GetClassGradeComponentDetailData {
    id: string,
    name: string,
    age: number,
}
