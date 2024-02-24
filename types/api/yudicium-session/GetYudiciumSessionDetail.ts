import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetYudiciumSessionDetailRoot {
    meta: MetaModel
    data: GetYudiciumSessionDetailData
}

export interface GetYudiciumSessionDetailData {
    id: string,
    name: string,
    age: number,
}
