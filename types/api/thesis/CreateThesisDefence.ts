import { MetaModel } from "../meta"

export interface CreateThesisDefenceRequest {
    thesis_id: string
    plan_date: string
    plan_start_time: string
    plan_end_time: string
    room_id: string
    examiners: CreateThesisDefenceLecturerRequest[]
}

export interface CreateThesisDefenceLecturerRequest {
    lecturer_id: string
    lecturer_name: string
    thesis_examiner_role_id: string
    thesis_examiner_role_name: string
}
  

export interface CreateThesisDefenceRoot {
    meta: MetaModel
    data: any
}