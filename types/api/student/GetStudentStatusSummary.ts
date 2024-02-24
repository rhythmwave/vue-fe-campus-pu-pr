import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetStudentSummaryListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentSummaryListData[]
}

export interface GetStudentSummaryListData {
    study_program_id: string
    study_program_name: string
    dikti_study_program_type: string
    study_level_short_name: string
    statuses: GetStudentSummaryStatus[]
}

export interface GetStudentSummaryStatus {
    status: string
    total: number
}