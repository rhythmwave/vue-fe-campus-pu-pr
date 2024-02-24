import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerLeaveListRequest {
    name: string
}
  

export interface GetLecturerLeaveListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerLeaveListData[]
}

export interface GetLecturerLeaveListData {
    id: string
    name: string
    id_national_lecturer: string
    front_title: string
    back_degree: string
    semester_school_year: string
    semester_type: string
    dikti_study_program_code: string
    study_program_name: string
    study_level_short_name: string
    dikti_study_program_type: string
    start_date: string
    end_date: string
    permit_number: string
    purpose: string
    remarks: string
}