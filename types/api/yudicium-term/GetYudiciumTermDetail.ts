import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetYudiciumTermDetailRoot {
    meta: MetaModel
    data: GetYudiciumTermDetailData
}

export interface GetYudiciumTermDetailData {
    id: string,
    name: string,
    age: number,
}
