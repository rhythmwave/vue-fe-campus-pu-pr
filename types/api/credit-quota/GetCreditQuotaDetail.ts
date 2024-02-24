import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetCreditQuotaDetailRoot {
    meta: MetaModel
    data: GetCreditQuotaDetaiData
}

export interface GetCreditQuotaDetaiData {
    id: string,
    name: string,
    age: number,
}
