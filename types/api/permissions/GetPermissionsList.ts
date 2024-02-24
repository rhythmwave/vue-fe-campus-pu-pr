import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetPermisssionsListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetPermisssionsListData[]
  }

  export interface GetPermisssionsListData {
    id: string
    name: string
  }
  