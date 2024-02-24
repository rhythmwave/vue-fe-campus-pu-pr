import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetSampleApiListRequest {
    name: string
}
  

export interface GetSampleApiListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetSampleApiListData[]
}

export interface GetSampleApiListData {
    id: string,
    name: string,
    age: number,
}