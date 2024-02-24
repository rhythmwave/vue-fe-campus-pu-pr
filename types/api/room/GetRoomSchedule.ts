import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetRoomScheduleRequest {
    name: string
}


export interface GetRoomScheduleRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetRoomScheduleData[]
}

export interface GetRoomScheduleData {
    room_id: string
    room_name: string
    dates: GetRoomScheduleDate[]
}

export interface GetRoomScheduleDate {
    date: string
    schedules: GetRoomScheduleSchedule[]
}

export interface GetRoomScheduleSchedule {
    start_time: number
    end_time: number
    subject_name: string
    class_name: string
    study_program_name: string
}