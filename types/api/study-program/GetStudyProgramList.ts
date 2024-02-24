import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetStudyProgramListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudyProgramListData[]
  }
  
  
  export interface Pagination {
    page: number
    limit: number
    prev: number
    next: number
    total_pages: number
    total_records: number
  }
  
  export interface GetStudyProgramListData {
    id: string
    name: string
    study_level_name: string
    dikti_study_program_type: string
    dikti_study_program_code: string
    accreditation: string
    active_curriculum_year: string
  }
  