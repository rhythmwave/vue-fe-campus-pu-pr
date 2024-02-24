import { MetaModel } from "../meta"
export interface GetGraduationPredicateDetailAdmin {
    meta: MetaModel
    data: GetGraduationPredicateDetailData
  }
  
  
  export interface GetGraduationPredicateDetailData {
    predicate: string,
    minimum_gpa: number,
    maximum_study_semester: number,
    repeat_course_limit: number,
    below_minimum_grade_point_limit: number
  }
  