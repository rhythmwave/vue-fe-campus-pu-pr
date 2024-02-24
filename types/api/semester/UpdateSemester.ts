import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateSemesterRequest {
    id: string
    semester_start_year: number
    semester_type: string
    start_date: string
    end_date: string
    study_plan_input_start_date: string
    study_plan_input_end_date: string
    study_plan_approval_start_date: string
    study_plan_approval_end_date: string
    reference_semester_id: string
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
    curriculum_id: string
}

export interface UpdateSemesterRoot {
    meta: MetaModel
    data: any
}
