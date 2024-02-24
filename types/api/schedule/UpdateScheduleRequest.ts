export interface UpdateScheduleRequest {
    id: string
    class_id: string
    room_id: string
    single_day_lecturer_id: string
    single_day_date: string
    day_of_week: number
    start_time: number
    end_time: number
    theory_credit: number
    practicum_credit: number
    field_practicum_credit: number
    is_exam: boolean
    is_theory_exam: boolean
    is_practicum_exam: boolean
    is_field_practicum_exam: boolean
    is_midterm_exam: boolean
    is_endterm_exam: boolean
    exam_supervisors: ExamSupervisorRequest[]
}
export interface ExamSupervisorRequest{
    exam_supervisor_id: string
    exam_supervisor_role_id: string
}