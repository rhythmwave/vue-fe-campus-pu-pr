import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetYudiciumDetailRoot {
    meta: MetaModel
    data: GetYudiciumDetailData
}

export interface GetYudiciumDetailData {
    id: string,
    name: string,
    age: number,
}
