import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetCuriculumListRequest {
    name: string
}
  

export interface GetCuriculumListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetCuriculumListData[]
}

export interface GetCuriculumListData {
    id: string
    study_program_id: string
    name: string
    year: string
    ideal_study_period: number
    maximum_study_period: number
    is_active: boolean
    study_program_name: string
    dikti_study_program_code: string
    total_subject: number
    total_subject_with_prerequisite: number
    total_subject_with_equivalency: number
}