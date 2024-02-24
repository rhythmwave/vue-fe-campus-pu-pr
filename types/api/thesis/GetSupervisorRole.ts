import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetSupervisorRoleRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetSupervisorRoleData[]
  }
  
  export interface GetSupervisorRoleData {
    id: string
    name: string
    sort: number
  }
  