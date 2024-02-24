import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetClassEventDetailRoot {
    meta: MetaModel
    data: GetClassEventDetailData
}

export interface GetClassEventDetailData {
    id: string,
    name: string,
    age: number,
}
