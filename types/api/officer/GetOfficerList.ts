import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetOfficerListRequest {
    name: string
}
  

export interface GetOfficerListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetOfficerListData[]
}

export interface GetOfficerListData {
    id: string
    id_national_lecturer: string
    name: string
    employee_no: string
    title: string
    english_title: string
    study_program_id: string
    study_program_name: string
    signature_path: string
    signature_path_type: string
    signature_url: string
    show_signature: boolean
}