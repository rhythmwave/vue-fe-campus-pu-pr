import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerAcademicGuidanceRequest {
    id: string
    subject: string
    session_date: string
    summary: string
    files: UpdateLecturerAcademicGuidanceFile[]
    student_ids: string[]
  }
  
  export interface UpdateLecturerAcademicGuidanceFile {
    title: string
    file_path: string
    file_path_type: string
  }
  

export interface UpdateLecturerAcademicGuidanceRoot {
    meta: MetaModel
    data: any
}
