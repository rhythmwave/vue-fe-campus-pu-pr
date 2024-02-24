import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentActivityListRequest {
    name: string
}
  

export interface GetStudentActivityListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentActivityListData[]
}

export interface GetStudentActivityListData {
    id: string
    study_program_id: string
    study_program_name: string
    semester_id: string
    semester_school_year: string
    semester_type: string
    activity_type: string
    title: string
  }
  