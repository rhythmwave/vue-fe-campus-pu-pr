import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetYudiciumStudentListRequest {
    studyProgramId: string,
    studentForceFrom: string,
    studentForceTo: string,
    nimNumberFrom: string,
    nimNumberTo: string,
    name: string,
    semesterId: string,
}


export interface GetYudiciumStudentListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetYudiciumStudentListData[]
}

export interface GetYudiciumStudentListData {
    id: string
    nim_number: number
    name: string
    dikti_study_program_code: string
    total_credit: number
    gpa: number
    status: string
    application_date: string
    done_yudicium: boolean
    study_program_name: string
    study_level_short_name: string
    dikti_study_program_type: string
}