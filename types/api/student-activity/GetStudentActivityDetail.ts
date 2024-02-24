import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentActivityDetailRoot {
    meta: MetaModel
    data: GetStudentActivityDetailData
}

export interface GetStudentActivityDetailData {
    id: string
    study_program_id: string
    study_program_name: string
    semester_id: string
    semester_school_year: string
    semester_type: string
    activity_type: string
    title: string
    location: string
    decision_number: string
    decision_date: string
    is_group_activity: boolean
    remarks: string
    participants: GetStudentActivityDetailParticipant[]
    mentors: GetStudentActivityDetailMentor[]
    examiners: GetStudentActivityDetailExaminer[]
}

export interface GetStudentActivityDetailParticipant {
    student_id: string
    nim_number: string
    name: string
    study_program_id: string
    study_program_name: string
    role: string
}

export interface GetStudentActivityDetailMentor {
    lecturer_id: string
    id_national_lecturer: string
    name: string
    front_title: string
    back_degree: string
    activity_category: string
    sort: number
}

export interface GetStudentActivityDetailExaminer {
    lecturer_id: string
    id_national_lecturer: string
    name: string
    front_title: string
    back_degree: string
    activity_category: string
    sort: number
}
