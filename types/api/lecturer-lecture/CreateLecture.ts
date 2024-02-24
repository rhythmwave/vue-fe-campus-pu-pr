import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLectureRoot {
    meta: MetaModel
    data: any
}

export interface CreateLectureRequest {
    id: string
    lecture_theme: string
    lecture_subject: string
    remarks: string
    is_manual_participation: boolean
    autonomous_participation_end_time: string
    participants: CreateLectureParticipantData[]
}

export interface CreateLectureParticipantData {
    name: string
    student_id: string
    is_attend: boolean
    is_sick: boolean
    is_leave: boolean
    is_awol: boolean
}