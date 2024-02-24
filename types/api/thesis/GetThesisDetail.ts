import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetThesisDetailRoot {
    meta: MetaModel
    data: GetThesisDetailData
  }
  
export interface GetThesisDetailData {
    id: string
    student_id: string
    student_name: string
    student_nim_number: number
    study_program_id: string
    start_semester_id: string
    start_semester_type: string
    start_semester_school_year: string
    finish_semester_id: string
    finish_semester_type: string
    finish_semester_school_year: string
    topic: string
    title: string
    english_title: string
    start_date: string
    finish_date: string
    remarks: string
    is_joint_thesis: boolean
    status: string
    proposal_seminar_date: string
    proposal_certificate_number: string
    proposal_certificate_date: string
    thesis_defense_count: number
    grade_point: number
    grade_code: string
    files: GetThesisDetailFileData[]
    thesis_supervisors: GetThesisDetailSupervisorData[]
}

export interface GetThesisDetailFileData {
    id: string
    file_url: string
    file_path: string
    file_path_type: string
    file_description: string
}

export interface GetThesisDetailSupervisorData {
    id: string
    lecturer_id: string
    lecturer_name: string
    lecturer_front_title: string
    lecturer_back_degree: string
    thesis_supervisor_role_id: string
    thesis_supervisor_role_name: string
    thesis_supervisor_role_sort: number
}
  