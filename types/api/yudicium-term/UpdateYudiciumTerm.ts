import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateYudiciumTermRequest {
    id: string
    term: string
    remarks: string
}
  

export interface UpdateYudiciumTermRoot {
    meta: MetaModel
    data: any
}
