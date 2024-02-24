import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetRegencyListRequest {
    name: string
}
  

export interface GetRegencyListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetRegencyListData[]
}

export interface GetRegencyListData {
    id: string,
    name: string,
    age: number,
}