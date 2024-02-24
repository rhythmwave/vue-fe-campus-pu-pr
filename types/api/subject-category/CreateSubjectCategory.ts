import { MetaModel } from "../meta"

export interface CreateSubjectCategoryRequest {
    code: string
    name: string
  }
  

export interface CreateSubjectCategoryRoot {
    meta: MetaModel
    data: any
}