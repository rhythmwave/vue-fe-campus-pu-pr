import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetAcademicGuidanceSessionListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetAcademicGuidanceSessionListData[]
}

export interface GetAcademicGuidanceSessionListData {
    id: string
    subject: string
    summary: string
    files: GetAcademicGuidanceSessionFile[]
    students: GetAcademicGuidanceSessionStudent[]
}

export interface GetAcademicGuidanceSessionFile {
    id: string
    title: string
    file_url: string
    file_path: string
    file_path_type: string
}
export interface GetAcademicGuidanceSessionStudent {
    id: string
    name: string
    nim_number: string
}