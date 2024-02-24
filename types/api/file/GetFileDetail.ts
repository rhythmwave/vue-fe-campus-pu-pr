import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetFileDetailRoot {
    meta: MetaModel
    data: GetFileDetaiData
}

export interface GetFileDetaiData {
    id: string,
    name: string,
    age: number,
}
