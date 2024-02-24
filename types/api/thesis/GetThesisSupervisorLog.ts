import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetThesisSupervisorLogRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetThesisSupervisorLogData[]
  }
  
export interface GetThesisSupervisorLogData {
    id: string
    id_national_lecturer: string
    name: string
    total_supervised_thesis: number
    active_supervised_thesis: number
    thesis_supervisor_roles: GetThesisSupervisorRoleData[]
}

export interface GetThesisSupervisorRoleData {
    id: string
    name: string
    total: number   
}
  