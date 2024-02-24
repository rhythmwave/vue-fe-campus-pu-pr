import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetDiktiStudyProgramListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetDiktiStudyProgramListData[]
  }
  
  
  export interface GetDiktiStudyProgramListData {
    id: string
    code: string
    name: string
    study_level_short_name: string
  }
  