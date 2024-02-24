import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpsertAcademicGuidanceDecisionRequest {
    lecturer_id: string
    semester_id: string
    decision_number: string
    decision_date: string
}
  

export interface UpsertAcademicGuidanceDecisionRoot {
  id: string
  decision_number: string
  decision_date: string
}
