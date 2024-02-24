import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetStudentClassParticipantDataRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentClassParticipantData[]
}

  
export interface GetStudentClassParticipantData {
    student_id: string
    student_nim_number: number
    student_name: string
    study_program_id: string
    study_program_name: string
    dikti_study_program_code: string
    dikti_study_program_type: string
    study_level_short_name: string
    total_attendance: number
    attendance_percentage: number
    total_sick: number
    total_leave: number
    total_awol: number
    is_attend: boolean
    is_sick: boolean
    is_leave: boolean
    is_awol: boolean
    grade_point: number
    grade_code: string
    graded_by_admin_id: string
    graded_by_admin_name: string
    graded_by_lecturer_id: string
    graded_by_lecturer_name: string
    graded_at: string
    subject_repetition: number
    grades: GradeData[]
}
export interface GradeData {
    subject_grade_component_id: string
    subject_grade_component_name: string
    initial_grade: number
    final_grade: number
}
  