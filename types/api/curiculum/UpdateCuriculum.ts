import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateCuriculumRequest {
    id: string
    name: string
    year: string
    rector_decision_number: string
    rector_decision_date: string
    aggreeing_party: string
    aggreement_date: string
    ideal_study_period: number
    maximum_study_period: number
    remarks: string
    is_active: boolean
    final_score_determinant: string
}
  

export interface UpdateCuriculumRoot {
    meta: MetaModel
    data: any
}
