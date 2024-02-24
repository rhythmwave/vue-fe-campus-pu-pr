import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetSemesterDetailRoot {
    meta: MetaModel
    data: GetSemesterDetailData
}

export interface GetSemesterDetailData {
    id: string
    semester_start_year: number
    school_year: string
    semester_type: string
    is_active: boolean
    start_date: string
    end_date: string
    study_plan_input_start_date: string
    study_plan_input_end_date: string
    study_plan_approval_start_date: string
    study_plan_approval_end_date: string
    reference_semester_id: string
    reference_semester_start_year: number
    reference_school_year: string
    reference_semester_type: string
    check_minimum_gpa: boolean
    check_passed_credit: boolean
    default_credit: number
    midterm_start_date: string
    midterm_end_date: string
    endterm_start_date: string
    endterm_end_date: string
    grading_start_date: string
    grading_end_date: string
    curriculums: Curriculum[]
}

export interface Curriculum {
    study_program_id: string
    study_program_name: string
    curriculum_id: string
    curriculum_name: string
}
