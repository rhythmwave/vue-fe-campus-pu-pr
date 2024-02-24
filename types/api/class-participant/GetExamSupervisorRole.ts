import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetExamSupervisorRoleListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetExamSupervisorRoleListData[]
}

  
export interface GetExamSupervisorRoleListData {
    id: string
    name: string
    sort: number
}
  