import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetGraduationStudentListRequest {
    studyProgramId: string,
    graduationSessionId: string,
}


export interface GetGraduationStudentListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetGraduationStudentListData[]
}

export interface GetGraduationStudentListData {
    id: string
    nim_number: number
    name: string
    dikti_study_program_code: string
    application_date: string
    study_program_name: string
    study_level_short_name: string
    dikti_study_program_type: string
}