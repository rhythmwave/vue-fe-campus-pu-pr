import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetGradeTypeListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetGradeTypeListData[]
}

export interface GetGradeTypeListData {
    id: string
    study_level_id: string
    study_level_short_name: string
    code: string
    grade_point: number
    minimum_grade: number
    maximum_grade: number
    grade_category: string
    grade_point_category: number
    label: string
    english_label: string
    start_date: string
    end_date: string
}
