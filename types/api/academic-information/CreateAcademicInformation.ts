import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface CreateAcademicInformationRoot {
    meta: MetaModel
    data: any
}

export interface CreateAcademicInformationRequest {
    type: string
    title: string
    announcement_date: string
    file_path: string
    file_path_type: string
    file_title: string
    content: string
    for_lecturer: boolean
    for_student: boolean
    study_program_ids: string[]
}
