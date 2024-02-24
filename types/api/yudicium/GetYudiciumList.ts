import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetYudiciumListRequest {
    name: string
}
  

export interface GetYudiciumListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetYudiciumListData[]
}

export interface GetYudiciumListData {
    id: string,
    name: string,
    age: number,
}