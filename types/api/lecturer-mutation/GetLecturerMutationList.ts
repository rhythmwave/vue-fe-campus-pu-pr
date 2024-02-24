import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerMutationListRequest {
    name: string
}
  

export interface GetLecturerMutationListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerMutationListData[]
}

export interface GetLecturerMutationListData {
    id: string
    name: string
    id_national_lecturer: string
    front_title: string
    back_degree: string
    semester_school_year: string
    semester_type: string
    dikti_study_program_code: string
    study_program_name: string
    study_level_short_name: string
    dikti_study_program_type: string
    mutation_date: string
    decision_number: string
    destination: string
}