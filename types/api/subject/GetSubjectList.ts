import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetSubjectListRequest {
    name: string
}
  

export interface GetSubjectListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetSubjectListData[]
}

export interface GetSubjectListData {
    id: string
    study_program_id: string
    study_program_name: string
    curriculum_id: string
    curriculum_name: string
    code: string
    trait: string
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
    equivalent_is_vice_versa: boolean
    classes: GetSubjectClassesListData[]
    is_mbkm: boolean
    is_thesis: boolean
    total_lesson_plan: number
}

export interface GetSubjectClassesListData {
    id: string
    name: string
}