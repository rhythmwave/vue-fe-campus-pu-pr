import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateCreditQuotaRequest {
    name: string
    age: number
}
  

export interface CreateCreditQuotaRoot {
    meta: MetaModel
    data: any
}

