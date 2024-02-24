import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerClassWorkSubmissionRequest {
    name: string
}
  

export interface GetLecturerClassWorkSubmissionRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerClassWorkSubmissionData[]
}

export interface GetLecturerClassWorkSubmissionData {
    id: string
    student_id: string
    nim_number: string
    name: string
    study_program_name: string
    file_url: string
    point: number
}