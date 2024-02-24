import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateGradeComponentRequest {
    study_program_id: string
    subject_category_id: string
    name: string
    is_active: boolean
}


export interface CreateGradeComponentRoot {
    meta: MetaModel
    data: any
}

