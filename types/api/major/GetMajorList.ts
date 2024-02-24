import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetMajorListRequest {
    name: string
}
  

export interface GetMajorListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetMajorListData[]
}

export interface GetMajorListData {
    id: string
    name: string
    faculty_name: string
}