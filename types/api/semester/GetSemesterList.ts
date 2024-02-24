import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetSemesterListRequest {
    name: string
}
  

export interface GetSemesterListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetSemesterListData[]
}

export interface GetSemesterListData {
    id: string
    semester_start_year: number
    school_year: string
    semester_type: string
    is_active: boolean
    semester_type_year: string
    study_program_id: string
    study_program_name: string
}