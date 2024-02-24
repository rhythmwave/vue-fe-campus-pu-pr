import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLectureListRequest {
    classId: string
}


export interface GetLectureListRoot {
    meta: MetaModel
    pagination: PaginationModel
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
    exam_supervisors: ExamSupervisor[]
    subject_name: string
    subject_code: string
    total_participant: number
}


export interface ExamSupervisor {
    id: string
    name: string
    front_title: string
    back_degree: string
    exam_supervisor_role_id: string
    exam_supervisor_role_name: string
  }
