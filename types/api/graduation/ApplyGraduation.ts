import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface ApplyGraduationRequest {
    student_id: string
    application_date: string
    graduation_session_id: string
}
  

export interface ApplyGraduationRoot {
    meta: MetaModel
    data: any
}

