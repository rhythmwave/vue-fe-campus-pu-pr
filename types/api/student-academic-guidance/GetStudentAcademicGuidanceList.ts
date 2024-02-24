import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentAcademicGuidanceListRequest {
    name: string
}
  

export interface GetStudentAcademicGuidanceListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentAcademicGuidanceListData[]
}

export interface GetStudentAcademicGuidanceListData {
    id: string,
    name: string,
    age: number,
}