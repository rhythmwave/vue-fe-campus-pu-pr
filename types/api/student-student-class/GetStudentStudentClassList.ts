import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentStudentClassListRequest {
    name: string
}
  

export interface GetStudentStudentClassListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentStudentClassListData[]
}

export interface GetStudentStudentClassListData {
    id: string
    name: string
    subject_code: string
    subject_name: string
    theory_credit: number
    practicum_credit: number
    field_practicum_credit: number
    studyporgram_subject: string
}