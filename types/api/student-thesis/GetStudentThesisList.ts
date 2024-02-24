import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentThesisListRequest {
    name: string
}
  

export interface GetStudentThesisListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentThesisListData[]
}

export interface GetStudentThesisListData {
    id: string,
    name: string,
    age: number,
}