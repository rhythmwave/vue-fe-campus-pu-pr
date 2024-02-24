import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetAcademicInformationListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetAcademicInformationListData[]
}

export interface GetAcademicInformationListData {
    id: string
    type: string
    title: string
    announcement_date: string
    file_url: string
    file_path: string
    file_path_type: string
    file_title: string
    content: string
    for_lecturer: boolean
    for_student: boolean
    study_programs: GetAcademicInformationStudyPogramData[]
}
export interface GetAcademicInformationStudyPogramData {
    study_program_id: string
    study_program_name: string
}
