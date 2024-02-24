import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetFileListRequest {
    name: string
}
  

export interface GetFileListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetFileListData[]
}

export interface GetFileListData {
    id: string,
    name: string,
    age: number,
}