import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetClassWorkSubmissionRequest {
    name: string
}
  

export interface GetClassWorkSubmissionRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetClassWorkSubmissionData[]
}

export interface GetClassWorkSubmissionData {
    id: string,
    name: string,
    age: number,
}