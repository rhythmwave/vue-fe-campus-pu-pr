import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetAdminActivityLogListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetAdminActivityLogListData[]
  }

  
  export interface GetAdminActivityLogListData {
    id: string
    admin_id: string
    admin_name: string
    admin_username: string
    module: string
    action: string
    ip_address: string
    user_agent: string
    execution_time: number
    memory_usage: number
    created_at: string
  }
  