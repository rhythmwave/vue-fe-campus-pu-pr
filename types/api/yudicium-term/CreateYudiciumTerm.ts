import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateYudiciumTermRequest {
    curriculum_id: string
    term: string
    remarks: string
}
  

export interface CreateYudiciumTermRoot {
    meta: MetaModel
    data: any
}

