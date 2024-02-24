import { MetaModel } from "../meta"

export interface UpdateThesisDefenceRequest {
    id: string
    plan_date: string
    plan_start_time: string
    plan_end_time: string
    room_id: string
    actual_date: string
    actual_start_time: string
    actual_end_time: string
    is_passed: boolean
    revision: string
    grade_code: string
    examiners: UpdateThesisDefenceExaminerRequest[]
}

export interface UpdateThesisDefenceExaminerRequest {
    lecturer_id: string
    lecturer_name: string
    thesis_examiner_role_id: string
    thesis_examiner_role_name: string
}

export interface UpdateThesisDefenceRoot {
    meta: MetaModel
    data: any
}