import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentSkpiListRequest {
    name: string
}
  

export interface GetStudentSkpiListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentSkpiListData[]
}

export interface GetStudentSkpiListData {
    id: string,
    name: string,
    age: number,
}