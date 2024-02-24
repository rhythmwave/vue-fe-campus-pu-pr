import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateAcademicGuidanceSessionRequest {
    academic_guidance_id: string
    subject: string
    session_date: string
    summary: string
    files: CreateAcademicGuidanceSessionFileRequest[]
    student_ids: string[]
}
export interface CreateAcademicGuidanceSessionFileRequest {
    file_path: string
    file_path_type: string
}

export interface CreateAcademicGuidanceSessionRoot {
    meta: MetaModel
    data: any
}

