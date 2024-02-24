import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetSampleListRequest {
    name: string
}
  

export interface GetSampleListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetSampleListData[]
}

export interface GetSampleListData {
    id: string,
    name: string,
    age: number,
}