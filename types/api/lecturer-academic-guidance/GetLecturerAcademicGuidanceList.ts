import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerAcademicGuidanceListRequest {
    name: string
}
  

export interface GetLecturerAcademicGuidanceListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerAcademicGuidanceListData[]
}

export interface GetLecturerAcademicGuidanceListData {
    id: string
    academic_guidance_id: string
    subject: string
    session_date: string
    summary: string
    files: GetLecturerAcademicGuidanceListFile[]
    students: GetLecturerAcademicGuidanceListStudent[]
  }
  
  export interface GetLecturerAcademicGuidanceListFile {
    id: string
    title: string
    file_url: string
    file_path: string
    file_path_type: string
  }
  
  export interface GetLecturerAcademicGuidanceListStudent {
    id: string
    name: string
    nim_number: number
  }
  