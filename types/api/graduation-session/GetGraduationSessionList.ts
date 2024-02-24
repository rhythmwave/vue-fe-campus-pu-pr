import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetGraduationSessionListRequest {
    name: string
}
  

export interface GetGraduationSessionListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetGraduationSessionListData[]
}

export interface GetGraduationSessionListData {
    id: string
    session_school_year: string
    session_number: number
    session_year: number
    session_date: string
}