import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface ApplyYudiciumRequest {
    student_id: string
    application_date: string
    with_thesis: boolean
}
  

export interface ApplyYudiciumRoot {
    meta: MetaModel
    data: any
}

