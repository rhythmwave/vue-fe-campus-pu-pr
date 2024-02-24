import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetStudentParticipationListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentParticipationListData[]
}

export interface GetStudentParticipationListData {
    id: string
    lecture_plan_date: string
    lecture_plan_day_of_week: number
    lecture_plan_start_time: number
    lecture_plan_end_time: number
    lecture_actual_date: string
    lecture_actual_day_of_week: number
    lecture_actual_start_time: number
    lecture_actual_end_time: number
    is_attend: boolean
    is_sick: boolean
    is_leave: boolean
    is_awol: boolean
}