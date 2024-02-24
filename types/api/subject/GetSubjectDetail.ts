import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetSubjectDetailRoot {
    meta: MetaModel
    data: GetSubjectDetailData
}

export interface GetSubjectDetailData {
    id: string
    study_program_id: string
    study_program_name: string
    curriculum_id: string
    curriculum_name: string
    code: string
    name: string
    short_name: string
    english_name: string
    english_short_name: string
    is_mandatory: boolean
    trait: string
    type: string
    subject_category_id: string
    subject_category_name: string
    curriculum_type: string
    theory_credit: number
    practicum_credit: number
    field_practicum_credit: number
    semester_package: number
    repeat_course_limit: number
    is_active: boolean
    has_lecture_unit: boolean
    has_teaching_material: boolean
    has_lecture_summary: boolean
    supporting_lecturer_id: string
    supporting_lecturer_name: string
    start_date: string
    end_date: string
    minimum_passing_grade_point: number
    minimum_mandatory_credit_taken: number
    minimum_optional_credit_taken: number
    minimum_total_credit_taken: number
    minimum_mandatory_credit_passed: number
    minimum_optional_credit_passed: number
    minimum_total_credit_passed: number
    minimum_gpa: number
    abstraction: string
    syllabus_path: string
    syllabus_path_type: string
    syllabus_url: string
    prerequisite_subjects: PrerequisiteSubject[]
    is_thesis: boolean
}
export interface PrerequisiteSubject {
    id: string
    code: string
    name: string
    prerequisite_type: string
    minimum_grade_point: number
  }