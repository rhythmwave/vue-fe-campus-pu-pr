import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetCalendarListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetCalendarListData[]
}

export interface GetCalendarListData {
    date: string
    lectures: GetCalendarListLectureData[]
}

export interface GetCalendarListLectureData {
    lecture_plan_start_time: number
    lecture_plan_end_time: number
    class_id: string
    class_name: string
    room_id: string
    room_name: string
    lecturer_id: string
    lecturer_name: string
    lecturer_front_title: string
    lecturer_back_degree: string
    foreign_lecturer_name: string
    foreign_lecturer_source_instance: string
}