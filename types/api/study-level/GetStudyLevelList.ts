import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetStudyLevelListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudyLevelListData[]
  }
  
  
  export interface GetStudyLevelListData {
    id: string
    code: string
    name: string
    short_name: string
  }
  