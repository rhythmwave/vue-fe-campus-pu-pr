import { MetaModel } from "../meta"

export interface EditExaminerRoleRequest {
    id: string
    name: string
    remarks: string
    sort: string
  }
  

export interface EditExaminerRoleRoot {
    meta: MetaModel
    data: any
}