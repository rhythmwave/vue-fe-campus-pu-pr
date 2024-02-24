import { MetaModel } from "../meta"

export interface EditSupervisorRoleRequest {
    id: string
    name: string
    sort: string
  }
  

export interface EditSupervisorRoleRoot {
    meta: MetaModel
    data: any
}