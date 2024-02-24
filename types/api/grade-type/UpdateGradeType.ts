import { MetaModel } from "../meta"

export interface UpdateGradeTypeRequest {
  id: string
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


export interface UpdateGradeTypeRoot {
  meta: MetaModel
  data: any
}