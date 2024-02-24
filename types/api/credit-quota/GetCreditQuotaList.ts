import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetCreditQuotaListRequest {
    name: string
}
  

export interface GetCreditQuotaListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetCreditQuotaListData[]
}

export interface GetCreditQuotaListData {
    id: string,
    name: string,
    age: number,
}