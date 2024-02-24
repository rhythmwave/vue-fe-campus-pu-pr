import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentTranscriptListRequest {
    name: string
}
  

export interface GetStudentTranscriptListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentTranscriptListData[]
}

export interface GetStudentTranscriptListData {
    id: string,
    name: string,
    age: number,
}