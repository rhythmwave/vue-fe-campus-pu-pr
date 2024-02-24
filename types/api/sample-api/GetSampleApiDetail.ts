import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetSampleApiDetailRoot {
    meta: MetaModel
    data: GetSampleApiDetaiData
}

export interface GetSampleApiDetaiData {
    id: string,
    name: string,
    age: number,
}
