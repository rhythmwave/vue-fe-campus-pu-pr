import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetReportStudentStatusListRequest {
    name: string
}
  

export interface GetReportStudentStatusListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetReportStudentStatusListData[]
}

export interface GetReportStudentStatusListData {
    study_program_name: string
    dikti_study_program_code: string
    dikti_study_program_type: string
    study_level_short_name: string
    statuses: GetReportStudentStatusListStatus[]
  }
  
  export interface GetReportStudentStatusListStatus {
    status: string
    total: number
  }