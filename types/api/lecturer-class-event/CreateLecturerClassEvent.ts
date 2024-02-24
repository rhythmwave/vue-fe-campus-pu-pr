import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerClassEventRequest {
    class_id: string
    title: string
    frequency: string
    event_time: string
    remarks: string
    is_active: boolean
}
  

export interface CreateLecturerClassEventRoot {
    meta: MetaModel
    data: any
}

