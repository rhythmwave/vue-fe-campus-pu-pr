import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetAdminClassExamSubmissionRequest {
    name: string
}
  

export interface GetAdminClassExamSubmissionRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetAdminClassExamSubmissionData[]
}

export interface GetAdminClassExamSubmissionData {
    id: string,
    name: string,
    age: number,
}