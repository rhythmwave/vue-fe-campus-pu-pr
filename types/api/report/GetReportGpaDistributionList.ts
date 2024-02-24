import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetReportGpaDistributionListRequest {
    study_program_id: string
    graduation_year_from: any
    graduation_year_to: any
}
  

export interface GetReportGpaDistributionListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetReportGpaDistributionListData[]
}

export interface GetReportGpaDistributionListData {
  graduation_school_year: string
  total_less_than_25: number
  percentage_less_than_25: number
  total_between_25_and_30: number
  percentage_between_25_and_30: number
  total_more_than_30: number
  percentage_more_than_30: number
  total_graduates: number
  average_gpa: number
}