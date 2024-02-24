import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerMutationRequest {
    id: string
    semester_id: string
    mutation_date: string
    decision_number: string
    destination: string
}
  

export interface UpdateLecturerMutationRoot {
    meta: MetaModel
    data: any
}
