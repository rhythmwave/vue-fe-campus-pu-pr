import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetAdminClassExamDetailRoot {
    meta: MetaModel
    data: GetAdminClassExamDetailData
}

export interface GetAdminClassExamDetailData {
    id: string,
    name: string,
    age: number,
}
