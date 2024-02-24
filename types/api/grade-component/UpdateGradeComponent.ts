import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateGradeComponentRequest {
    id: string
    study_program_id: string
    subject_category_id: string
    name: string
    is_active: boolean
}
  

export interface UpdateGradeComponentRoot {
    meta: MetaModel
    data: any
}
