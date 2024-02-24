import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetStudyPlanRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudyPlanData
}

export interface GetStudyPlanData{
    study_plan_input_start_date: string
    study_plan_input_end_date: string
    id: string
    is_approved: boolean
    is_submitted: boolean
    student_id: string
    student_nim_number: number
    student_name: string
    study_program_id: string
    study_program_name: string
    semester_id: string
    semester_school_year: string
    semester_type: string
    maximum_credit: number
    academic_guidance_lecturer_id: string
    academic_guidance_lecturer_name: string
    academic_guidance_lecturer_front_title: string
    academic_guidance_lecturer_back_degree: string
    classes: GetStudyPlanClassesData[]
}

export interface GetStudyPlanClassesData {
    id: string
    name: string
    subject_id: string
    subject_name: string
    subject_code: string
    subject_theory_credit: number
    subject_field_practicum_credit: number
    subject_practicum_credit: number
    schedules: GetStudyPlanClassesScheduleData[]
}

export interface GetStudyPlanClassesScheduleData {
    day_of_week: number
    start_time: number
    end_time: number
    room_id: string
    room_name: string
}