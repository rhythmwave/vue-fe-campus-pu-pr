import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentStudyPlanListRequest {
    name: string
}
  

export interface GetStudentStudyPlanListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentStudyPlanListData[]
}

export interface GetStudentStudyPlanListData {
    id: string,
    name: string,
    age: number,
}