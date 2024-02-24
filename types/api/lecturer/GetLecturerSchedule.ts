import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerScheduleRequest {
    name: string
}


export interface GetLecturerScheduleRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerScheduleData[]
}

export interface GetLecturerScheduleData {
    id: string
    id_national_lecturer: string
    name: string
    front_title: string
    back_degree: string
    study_program_name: string
    subject_name: string
    class_name: string
    total_schedule_credit: number
    total_subject_credit: number
    day_of_week: number
    start_time: number
    end_time: number
    room_name: string
    total_participant: number
    lecture_plan_date: string
}