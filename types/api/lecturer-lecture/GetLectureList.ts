import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLectureListRoot {
    meta: MetaModel
    data: GetLectureListData[]
}

export interface GetLectureListData {
    id: string
    lecture_plan_date: string
    lecture_plan_day_of_week: number
    lecture_plan_start_time: number
    lecture_plan_end_time: number
    lecture_actual_date: string
    lecture_actual_day_of_week: number
    lecture_actual_start_time: number
    lecture_actual_end_time: number
    is_manual_participation: boolean
    autonomous_participation_start_time: string
    autonomous_participation_end_time: string
    attending_participant: number
    updated_at: string
}
