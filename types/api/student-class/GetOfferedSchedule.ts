import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetOfferedScheduleRequest {
}

export interface GetOfferedScheduleRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetOfferedScheduleData
}

export interface GetOfferedScheduleData {
    study_program_name: string
    subject_code: string
    subject_name: string
    semester_package: number
    theory_credit: number
    practicum_credit: number
    field_practicum_credit: number
    subject_minimum_passing_grade_point: number
    subject_is_mandatory: boolean
    maximum_participant: number
    prerequisite_subjects: string[]
    regular_schedules: GetOfferedScheduleRegularSchedule[]
    single_day_schedules: GetOfferedScheduleRegularSchedule[]
    midterm_exam_date: string
    midterm_start_time: number
    midterm_end_time: number
    midterm_room_name: string
    endterm_exam_date: string
    endterm_start_time: number
    endterm_end_time: number
    endterm_room_name: string
}

export interface GetOfferedScheduleRegularSchedule {
    day_of_week: number
    start_time: number
    end_time: number
    room_name: string
}