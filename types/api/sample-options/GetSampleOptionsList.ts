import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetSampleOptionsListRequest {
    name: string
}
  

export interface GetSampleOptionsListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetSampleOptionsListData[]
}

export interface GetSampleOptionsListData {
    id: string,
    name: string,
    age: number,
}