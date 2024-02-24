import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetRegistrationThesisRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetRegistrationThesisData[]
  }
  
export interface GetRegistrationThesisData {
    id: string
    student_id: string
    student_name: string
    student_nim_number: number
    student_status: string
    study_level_short_name: string
    study_program_id: string
    study_program_name: string
    thesis_defense_actual_date: string
    thesis_defense_actual_end_time: number
    thesis_defense_actual_start_time: number
    thesis_defense_count: number
    thesis_defense_id: string
    thesis_defense_is_passed: false
    thesis_defense_plan_date: string
    thesis_defense_plan_end_time: number
    thesis_defense_plan_start_time: number
    thesis_id: string
    thesis_status: string
    thesis_title: string
    dikti_study_program_type: string
    dikti_study_program_code: string
    created_at: string
}
  