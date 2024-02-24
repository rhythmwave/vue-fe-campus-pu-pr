import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetYudiciumSessionListRequest {
    name: string
}
  

export interface GetYudiciumSessionListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetYudiciumSessionListData[]
}

export interface GetYudiciumSessionListData {
    id: string
    semester_id: string
    semester_school_year: string
    semester_type: string
    name: string
    session_date: string
  }