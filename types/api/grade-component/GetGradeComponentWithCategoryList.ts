import { MetaModel } from "~~/types/backoffice/backofficeTypes"
import { PaginationModel } from "../pagination"

export interface GetGradeComponentWithCategoryListRequest {
    name: string
}
  

export interface GetGradeComponentWithCategoryListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetGradeComponentWithCategoryListData[]
}

export interface GetGradeComponentWithCategoryListData {
    study_program_id: string
    study_program_name: string
    subject_category_id: string
    subject_category_name: string
    grade_components: GetGradeComponentWithCategoryListGradeComponent[]
}

export interface GetGradeComponentWithCategoryListGradeComponent {
    id: string
    name: string
    default_percentage: number
    is_active: boolean,
}