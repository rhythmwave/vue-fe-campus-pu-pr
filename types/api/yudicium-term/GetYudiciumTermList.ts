import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetYudiciumTermListRequest {
    name: string
}
  

export interface GetYudiciumTermListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetYudiciumTermListData[]
}

export interface GetYudiciumTermListData {
    id: string
    curriculum_id: string
    curriculum_name: string
    study_program_id: string
    study_program_name: string
    term: string
    remarks: string
}