import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetOfficerDetailRoot {
    meta: MetaModel
    data: GetOfficerDetaiData
}

export interface GetOfficerDetaiData {
    id: string,
    name: string,
    age: number,
}
