import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetThesisRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetThesisData[]
  }
  
  export interface GetThesisData {
    id: string
    topic: string
    title: string
    status: string
    student_id: string
    student_name: string
    student_nim_number: number
    student_status: string
    study_program_id: string
    study_program_name: string
    start_semester_id: string
    start_semester_school_year: number
    start_semester_type: string
    dikti_study_program_code: string
    dikti_study_program_type: string
    study_level_short_name: string
    student_has_thesis_study_plan: boolean
  }
  