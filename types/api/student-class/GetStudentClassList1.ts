import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetStudentClassRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentClassList[]
}

export interface GetStudentClassList {
    id: string
    class_id: string
    class_name: string
    subject_id: string
    subject_code: string
    subject_name: string
    subject_total_credit: number
    subject_repetition: number
    monday_schedules: ScheduleData
    tuesday_schedules: ScheduleData
    wednesday_schedules: ScheduleData
    thursday_schedules: ScheduleData
    friday_schedules: ScheduleData
    saturday_schedules: ScheduleData
    sunday_schedules: ScheduleData
    total_attendance: number
    total_sick: number
    total_leave: number
    total_awol: number
    grade_point: number
    grade_code: string
    graded_by_admin_id: string
    graded_by_admin_name: string
    graded_by_lecturer_id: string
    graded_by_lecturer_name: string
    graded_at: string
    attendance_percentage: number
    total_lecture: number
    subject_is_mandatory: boolean
}

export interface ScheduleData {
    start_time: number
    end_time: number
    room_id: string
    room_name: string
}