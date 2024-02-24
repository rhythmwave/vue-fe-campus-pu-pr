import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateAcademicGuidanceRequest {
    id: string
    decision_number: string
    decision_date: string
}
  

export interface UpdateAcademicGuidanceRoot {
  id: string
  decision_number: string
  decision_date: string
}
