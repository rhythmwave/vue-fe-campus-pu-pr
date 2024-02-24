import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetClassWorkDetailRoot {
    meta: MetaModel
    data: GetClassWorkDetailData
}

export interface GetClassWorkDetailData {
    id: string,
    name: string,
    age: number,
}
