import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentParentProfileListRequest {
    name: string
}
  

export interface GetStudentParentProfileListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentParentProfileListData[]
}

export interface GetStudentParentProfileListData {
    id: string,
    name: string,
    age: number,
}