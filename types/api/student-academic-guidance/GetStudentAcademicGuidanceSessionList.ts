import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentAcademicGuidanceSessionListRequest {
    name: string
}
  

export interface GetStudentAcademicGuidanceSessionListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentAcademicGuidanceSessionListData[]
}

export interface GetStudentAcademicGuidanceSessionListData {
    id: string
    academic_guidance_id: string
    subject: string
    session_date: string
    summary: string
    files: GetStudentAcademicGuidanceSessionFile[]
    students: GetStudentAcademicGuidanceSessionStudent[]
  }
  
  export interface GetStudentAcademicGuidanceSessionFile {
    id: string
    title: string
    file_url: string
    file_path: string
    file_path_type: string
  }
  
  export interface GetStudentAcademicGuidanceSessionStudent {
    id: string
    name: string
    nim_number: number
  }