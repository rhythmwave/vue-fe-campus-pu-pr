import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerMutationRequest {
    lecturer_id: string
    semester_id: string
    mutation_date: string
    decision_number: string
    destination: string
}
  

export interface CreateLecturerMutationRoot {
    meta: MetaModel
    data: any
}

