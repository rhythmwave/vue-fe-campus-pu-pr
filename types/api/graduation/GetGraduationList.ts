import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetGraduationListRequest {
    name: string
}
  

export interface GetGraduationListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetGraduationListData[]
}

export interface GetGraduationListData {
    id: string,
    name: string,
    age: number,
}