import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerAssignedClassListRoot {
    meta: MetaModel
    data: GetLecturerAssignedClassListData[]
}

export interface GetLecturerAssignedClassListData {
    id: string
    name: string
    subject_code: string
    subject_name: string
    theory_credit: number
    practicum_credit: number
    field_practicum_credit: number
    study_program_name: string
    total_attendance: number
    total_lecture_done: number
    attendance_percentage: number
    is_grading_responsible: boolean
    study_program_id: string

    //custom
    studyporgram_subject:string 
}
