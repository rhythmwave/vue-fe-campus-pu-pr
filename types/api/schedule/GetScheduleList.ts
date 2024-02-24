import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetScheduleListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetScheduleListData[]
}

export interface GetScheduleListData {
    id: string
    lecture_plan_date: string
    lecture_plan_day_of_week: number
    lecture_plan_start_time: number
    lecture_plan_end_time: number
    lecture_actual_date: string
    lecture_actual_day_of_week: number
    lecture_actual_start_time: number
    lecture_actual_end_time: number
    lecturer_id: string
    lecturer_name: string
    foreign_lecturer_name: string
    foreign_lecturer_source_instance: string
    is_original_lecturer: boolean
    class_id: string
    class_name: string
    room_id: string
    room_name: string
    is_midterm_exam: boolean
    is_endterm_exam: boolean
    is_theory_exam: boolean
    is_practicum_exam: boolean
    is_field_practicum_exam: boolean
    exam_supervisors: ExamSupervisorData[]
    subject_name: string
    subject_code: string
    total_participant: number
    theory_credit: number
    practicum_credit: number
    field_practicum_credit: number
    single_day_date: string
    start_time: string
    end_time: string
    single_day_lecturer_front_title: string
    single_day_lecturer_name: string
    single_day_lecturer_back_degree: string
}

export interface LetcturerData {
    id: string
    name: string
    front_title: string
    back_degree: string
}
export interface ExamSupervisorData {
    id: string
    name: string
    front_title: string
    back_degree: string
    exam_supervisor_role_id: string
    exam_supervisor_role_name: string
}
  