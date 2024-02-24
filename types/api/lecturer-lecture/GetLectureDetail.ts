import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLectureDetailRoot {
    meta: MetaModel
    data: GetLectureDetailData
}

export interface GetLectureDetailData {
    id: string
    subject_id: string
    subject_name: string
    class_id: string
    class_name: string
    semester_id: string
    semester_school_year: string
    semester_type: string
    study_program_id: string
    study_program_name: string
    lecture_theme: string
    lecture_subject: string
    remarks: string
    students: GetLectureDetailStudentData[]
}

export interface GetLectureDetailStudentData {
    id: string
    nim_number: number
    name: string
    is_attend: boolean
    is_sick: boolean
    is_leave: boolean
    is_awol: boolean
}