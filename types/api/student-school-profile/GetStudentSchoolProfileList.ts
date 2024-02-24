import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentSchoolProfileListRequest {
    name: string
}
  

export interface GetStudentSchoolProfileListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentSchoolProfileListData[]
}

export interface GetStudentSchoolProfileListData {
    id: string,
    name: string,
    age: number,
}