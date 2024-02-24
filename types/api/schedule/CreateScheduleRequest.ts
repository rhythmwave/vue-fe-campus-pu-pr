export interface CreateScheduleRequest {
    class_id: string
    lecture_plans: CreateScheduleLecturePlanRequest[]
}
export interface CreateScheduleLecturePlanRequest {
    lecture_plan_date: string
    lecture_plan_start_time: number
    lecture_plan_end_time: number
    room_id: string
    lecturer_id: string
    is_exam: boolean
    is_theory_exam: boolean
    is_practicum_exam: boolean
    is_field_practicum_exam: boolean
    is_midterm_exam: boolean
    is_endterm_exam: boolean
    exam_supervisors: CreateScheduleExamSupervisorsRequest[]
}
export interface CreateScheduleExamSupervisorsRequest {
    exam_supervisor_id: string
    exam_supervisor_name: string
    exam_supervisor_role_id: string
    exam_supervisor_role_name: string
}