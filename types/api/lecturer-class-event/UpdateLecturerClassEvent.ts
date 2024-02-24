import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerClassEventRequest {
    id: string
    title: string
    frequency: string
    event_time: string
    remarks: string
    is_active: boolean
}
  

export interface UpdateLecturerClassEventRoot {
    meta: MetaModel
    data: any
}
