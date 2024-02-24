import { MetaModel } from "../meta"

export interface UpdateSubjectCategoryRequest {
    id: string
    code: string
    name: string
  }
  

export interface UpdateSubjectCategoryRoot {
    meta: MetaModel
    data: any
}