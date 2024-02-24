import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetSampleOptionsDetailRoot {
    meta: MetaModel
    data: GetSampleOptionsDetaiData
}

export interface GetSampleOptionsDetaiData {
    id: string,
    name: string,
    age: number,
}
