import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface BulkUpdateGradeComponentPercentageRequest {
    study_program_id: string
    subject_category_id: string
    grade_components: BulkGradeComponentRequest[]
}
  

export interface BulkGradeComponentRequest {
    id: string
    default_percentage: number
    is_active: boolean
}

export interface BulkUpdateGradeComponentPercentageRoot {
    meta: MetaModel
    data: any
}
