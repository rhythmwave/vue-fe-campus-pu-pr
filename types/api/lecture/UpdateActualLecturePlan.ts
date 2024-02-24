import { MetaModel } from "~~/types/backoffice/backofficeTypes"
export interface UpdateActualLecturePlanRoot {
    meta: MetaModel
    data: any
}
export interface UpdateActualLecturePlanRequest {
    id: string
    room_id: string
    lecturer_id: string
    foreign_lecturer_name: string
    foreign_lecturer_source_instance: string
    lecture_plan_date: string
    lecture_plan_start_time: number
    lecture_plan_end_time: number
    lecture_actual_date: string
    lecture_actual_start_time: number
    lecture_actual_end_time: number
    lecture_theme: string
    lecture_subject: string
    remarks: string
    participants: UpdateActualLecturePlanParticipant[]
}
export interface UpdateActualLecturePlanParticipant {
    name: string
    student_id: string
    is_attend: boolean
    is_sick: boolean
    is_leave: boolean
    is_awol: boolean
}