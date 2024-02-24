import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetCurriculumListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetCurriculumListData[]
  }
  
  
  export interface Pagination {
    page: number
    limit: number
    prev: number
    next: number
    total_pages: number
    total_records: number
  }
  
  export interface GetCurriculumListData {
    id: string
    study_program_id: string
    name: string
    year: string
    ideal_study_period: number
    maximum_study_period: number
    is_active: boolean
    study_program_name: string
    dikti_study_program_code: string
  }
  