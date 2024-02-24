import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerStudyProgramListRequest {
    name: string
}
  

export interface GetLecturerStudyProgramListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerStudyProgramListData[]
}

export interface GetLecturerStudyProgramListData {
    id: string
    name: string
    study_level_short_name: string
    dikti_study_program_type: string
}