import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetExaminerRoleRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetExaminerRoleData[]
  }
  
  export interface GetExaminerRoleData {
    id: string
    name: string
    remarks: string
    sort: number
  }
  