import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerClassDetailRoot {
    meta: MetaModel
    data: GetLecturerClassDetailData
}

export interface GetLecturerClassDetailData {
    id: string
    name: string
    study_program_id: string
    study_program_name: string
    dikti_study_program_type: string
    study_level_short_name: string
    semester_id: string
    semester_school_year: string
    semester_type: string
    grading_start_date: string
    grading_end_date: string
    curriculum_id: string
    curriculum_name: string
    curriculum_year: string
    subject_id: string
    subject_code: string
    subject_name: string
    is_grading_responsible: boolean
    grade_components: GetLecturerClassDetailGradeComponentData[]
    students: GetLecturerClassDetailStudentData[]
    grade_types: GetLecturerClassDetailStudentGradeTypeData[]
}
export interface GetLecturerClassDetailGradeComponentData {
    id: string
    name: string
    percentage: number
}

export interface GetLecturerClassDetailStudentData {
    id: string
    nim_number: number
    name: string
    grade_point: number
    grade_code: string
    grades: GetLecturerClassDetailStudentGradeData[]
}

export interface GetLecturerClassDetailStudentGradeData {
    subject_grade_component_id: string
    subject_grade_component_name: string
    initial_grade: number
    final_grade: number
}
export interface GetLecturerClassDetailStudentGradeTypeData {
    code: string
    end_date: string
    english_label: string
    grade_category: string
    grade_point: number
    grade_point_category: number
    id: string
    label: string
    maximum_grade: number
    minimum_grade: number
    start_date: string
    study_level_id: string
    study_level_short_name: string
}
