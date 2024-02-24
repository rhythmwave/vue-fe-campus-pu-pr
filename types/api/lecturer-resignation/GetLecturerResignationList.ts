import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerResignationListRequest {
    name: string
}
  

export interface GetLecturerResignationListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerResignationListData[]
}

export interface GetLecturerResignationListData {
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
    resign_date: string
    resignation_number: string
    purpose: string
    remarks: string 
}