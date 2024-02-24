import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetRoleListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetRoleListData[]
  }
  export interface GetRoleListData {
    id: string
    name: string
    description: string
    study_programs: GetRoleListStudyProgram[]
    permissions: GetRoleListPermission[]
  }
  
  export interface GetRoleListStudyProgram {
    id: string
    name: string
    study_level_short_name: string
    dikti_study_program_type: string
  }
  
  export interface GetRoleListPermission {
    id: string
    name: string
  }
  