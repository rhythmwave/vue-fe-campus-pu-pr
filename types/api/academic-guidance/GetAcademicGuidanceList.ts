import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetAcademicGuidanceListRequest {
    name: string
}
  

export interface GetAcademicGuidanceListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetAcademicGuidanceListData[]
}

export interface GetAcademicGuidanceListData {
    id: string,
    name: string,
    age: number,
}