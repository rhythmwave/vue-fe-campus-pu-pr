import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetAcademicGuidanceStudentListRequest {
    name: string
}
  

export interface GetAcademicGuidanceStudentListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetAcademicGuidanceStudentListData[]
}

export interface GetAcademicGuidanceStudentListData {
    id: string,
    name: string,
    age: number,
}