import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentLectureListRequest {
    name: string
}
  

export interface GetStudentLectureListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentLectureListData[]
}

export interface GetStudentLectureListData {
    id: string,
    name: string,
    age: number,
}