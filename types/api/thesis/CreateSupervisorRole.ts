import { MetaModel } from "../meta"

export interface CreateSupervisorRoleRequest {
    name: string
    sort: string
  }
  

export interface CreateSupervisorRoleRoot {
    meta: MetaModel
    data: any
}