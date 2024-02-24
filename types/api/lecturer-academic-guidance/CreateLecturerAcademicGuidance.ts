import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerAcademicGuidanceRequest {
    semester_id: string
    subject: string
    session_date: string
    summary: string
    files: CreateLecturerAcademicGuidanceFile[]
    student_ids: string[]
}

export interface CreateLecturerAcademicGuidanceFile {
    file_path: string
    file_path_type: string
    title: string
}



export interface CreateLecturerAcademicGuidanceRoot {
    meta: MetaModel
    data: any
}

