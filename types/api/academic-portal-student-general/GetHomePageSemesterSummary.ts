import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetHomePageSemesterSummaryRoot {
    meta: MetaModel
    data: GetHomePageSemesterSummaryStudentData
}

export interface GetHomePageSemesterSummaryStudentData {
    status: string
    semester_id: string
    semester_school_year: string
    semester_type: string
    study_program_id: string
    study_program_name: string
    has_paid: boolean
    academic_guidance_lecturer_id: string
    academic_guidance_lecturer_name: string
    academic_guidance_lecturer_front_title: string
    academic_guidance_lecturer_back_degree: string
    maximum_credit: number
    study_plan_input_start_date: string
    study_plan_input_end_date: string
    study_plan_approval_start_date: string
    study_plan_approval_end_date: string
    total_mandatory_credit_taken: number
    total_optional_credit_taken: number
    gpa: number
}
