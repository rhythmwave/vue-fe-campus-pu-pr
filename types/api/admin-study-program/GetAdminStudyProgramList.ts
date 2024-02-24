import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetAdminStudyProgramListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetAdminStudyProgramListData[]
}

  
  export interface GetAdminStudyProgramListData {
    id: string
    study_program_id: string
    study_program_name: string
    curriculum_id: string
    curriculum_name: string
    code: string
    name: string
    is_mandatory: boolean
    semester_package: number
    theory_credit: number
    practicum_credit: number
    field_practicum_credit: number
    subject_prerequisite_id: string
    prerequisite_type: string
    prerequisite_minimum_grade_point: number
    equivalent_study_program_id: string
    equivalent_study_program_name: string
    equivalent_curriculum_id: string
    equivalent_curriculum_name: string
    equivalent_subject_code: string
    equivalent_subject_name: string
    equivalent_subject_id: string
    subject_category_id: string
    subject_category_name: string
    study_level_name: string
    dikti_study_program_type: string
    dikti_study_program_code: string
    accreditation: string
    active_curriculum_year: string
    degree: string
    short_degree: string
    english_degree: string
  }
  