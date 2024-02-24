import { MetaModel } from "~~/types/backoffice/backofficeTypes"
import { PaginationModel } from "../pagination"

export interface GetGradeComponentListRequest {
    name: string
}
  

export interface GetGradeComponentListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetGradeComponentListData[]
}

export interface GetGradeComponentListData {
    id: string
    study_program_id: string
    study_program_name: string
    subject_category_id: string
    subject_category_name: string
    name: string
    is_active: boolean
}