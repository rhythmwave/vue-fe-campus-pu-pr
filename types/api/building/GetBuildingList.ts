import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetBuildingListRequest {
    name: string
}
  

export interface GetBuildingListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetBuildingListData[]
}

export interface GetBuildingListData {
    id: string
    level: string
    faculty_id: string
    faculty_name: string
    major_id: string
    major_name: string
    code: string
    name: string
}