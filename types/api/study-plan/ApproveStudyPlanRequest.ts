import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface ApproveStudyPlanRequest {
    study_plan_ids: string[]
    is_approved: boolean
}

export interface ApproveStudyPlanRoot {
    meta: MetaModel
    data: any
}