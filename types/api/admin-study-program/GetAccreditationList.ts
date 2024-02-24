import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetAccreditationListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetAccreditationListData[]
  }
  
  export interface GetAccreditationListData {
    id: string
    study_program_id: string
    decree_number: string
    decree_date: string
    decree_due_date: string
    accreditation: string
    is_active: boolean
  }
  