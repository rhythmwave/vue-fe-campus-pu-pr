import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetReportStudyDurationListRequest {
  study_program_id: string
  graduation_year_from: any
  graduation_year_to: any
}


export interface GetReportStudyDurationListRoot {
  meta: MetaModel
  pagination: PaginationModel
  data: GetReportStudyDurationListData[]
}

export interface GetReportStudyDurationListData {

  graduation_school_year: string
  total_less_than_3: number
  percentage_less_than_3: number
  total_between_3_and_35: number
  percentage_between_3_and_35: number
  total_between_35_and_4: number
  percentage_between_35_and_4: number
  total_more_than_4: number
  percentage_more_than_4: number
  total_graduates: number
  average_study_duration: number
}
