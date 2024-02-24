import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetOfficerActionListRequest {
    name: string
}


export interface GetOfficerActionListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetOfficerActionListData[]
}

export interface GetOfficerActionListData {
    id: string
    document_type_id: string
    document_type_name: string
    document_action_id: string
    document_action_action: string
    document_action_english_action: string
    officer_id: string
    officer_name: string
    officer_title: string
    officer_english_title: string
    officer_study_program_id: string
    officer_study_program_name: string
}