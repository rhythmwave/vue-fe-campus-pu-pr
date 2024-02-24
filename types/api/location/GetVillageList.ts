import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetVillageListRequest {
    name: string
}
  

export interface GetVillageListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetVillageListData[]
}

export interface GetVillageListData {
    id: string,
    name: string,
}