import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetAcademicPortalActivityLogListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetAcademicPortalActivityLogListData[]
  }

  
  export interface GetAcademicPortalActivityLogListData {
    id: string
    user_type: string
    user_id: string
    user_name: string
    user_username: string
    module: string
    action: string
    ip_address: string
    user_agent: string
    execution_time: number
    memory_usage: number
    created_at: string
  }
  