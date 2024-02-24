import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DoYudiciumRequest {
    yudicium_session_id: string
    yudicium_number: string
    yudicium_date: string
    student_ids: string[]
}
  

export interface DoYudiciumRoot {
    meta: MetaModel
    data: any
}

