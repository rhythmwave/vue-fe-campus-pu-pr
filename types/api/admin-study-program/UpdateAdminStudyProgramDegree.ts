import { MetaModel } from "../meta"

export interface UpdateAdminStudyProgramDegreeRequest {
  study_program_id: string
  degree: string
  short_degree: string
  english_degree: string
}

export interface UpdateAdminStudyProgramDegreeRoot {
  meta: MetaModel
  data: any
}
