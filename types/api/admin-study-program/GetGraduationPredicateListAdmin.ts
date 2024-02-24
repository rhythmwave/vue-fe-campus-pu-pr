import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetGraduationPredicateListAdmin {
    meta: MetaModel
    pagination: PaginationModel
    data: GetGraduationPredicateListData[]
}

  
  export interface GetGraduationPredicateListData {
    id: string
    predicate: string
    minimum_gpa: number
    maximum_study_semester: number
    repeat_course_limit: number
    below_minimum_grade_point_limit: number
  }
  