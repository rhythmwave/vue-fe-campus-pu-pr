import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetDistrictListRequest {
    name: string
}
  

export interface GetDistrictListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetDistrictListData[]
}

export interface GetDistrictListData {
    id: string,
    name: string,
}