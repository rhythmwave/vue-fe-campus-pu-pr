import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateCreditQuotaRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateCreditQuotaRoot {
    meta: MetaModel
    data: any
}
