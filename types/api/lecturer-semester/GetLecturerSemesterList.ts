import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerSemesterListRequest {
    name: string
}
  

export interface GetLecturerSemesterListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerSemesterListData[]
}

export interface GetLecturerSemesterListData {
    id: string
    semester_start_year: number
    school_year: string
    semester_type: string
    is_active: boolean
    start_date: string
    end_date: string
    midterm_start_date: string
    midterm_end_date: string
    endterm_start_date: string
    endterm_end_date: string
    semester_type_year: string
}