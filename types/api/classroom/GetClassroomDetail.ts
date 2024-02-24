import { MetaModel } from "../meta"

export interface GetClassroomDetailRoot {
    meta: MetaModel
    data: GetClassroomDetail
  }

  
export interface GetClassroomDetail {
    id: string
    name: string
    study_program_id: string
    study_program_name: string
    dikti_study_program_type: string
    study_level_short_name: string
    semester_id: string
    semester_start_year: number
    school_year: string
    semester_type: string
    curriculum_id: string
    curriculum_name: string
    curriculum_year: string
    subject_id: string
    subject_code: string
    subject_name: string
    scope: string
    is_online: boolean
    is_offline: boolean
    minimum_participant: number
    maximum_participant: number
    total_participant: number
    remarks: string
    is_active: boolean
    lecturers: LetcturerData[]
    grade_components: GradeComponentData[]
    study_level_id: string
    application_deadline: string
}

export interface LetcturerData {
    id: string
    name: string
    front_title: string
    back_degree: string
    is_grading_responsible: boolean
}
export interface GradeComponentData {
    id: string
    name: string
}
  