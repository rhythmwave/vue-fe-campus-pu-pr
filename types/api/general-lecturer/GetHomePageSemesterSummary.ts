import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetHomePageSemesterSummaryRoot {
    meta: MetaModel
    data: GetHomePageSemesterSummaryData
}

export interface GetHomePageSemesterSummaryData {
    study_plan_approval_start_date: string
    study_plan_approval_end_date: string
    academic_guidance_total_student: number
    total_class: number
    school_year: string
    semester_type: string
    grading_start_date: string
    grading_end_date: string
    semester_id: string
}
