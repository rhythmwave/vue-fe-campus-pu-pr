import { MetaModel } from "../meta"

export interface CreateExaminerRoleRequest {
    name: string
    remarks: string
    sort: string
  }
  

export interface CreateExaminerRoleRoot {
    meta: MetaModel
    data: any
}