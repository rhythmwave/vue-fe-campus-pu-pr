import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetExamSupervisorListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetExamSupervisorListData[]
}

  
export interface GetExamSupervisorListData {
    id: string
    id_national_lecturer: string
    name: string
}
  