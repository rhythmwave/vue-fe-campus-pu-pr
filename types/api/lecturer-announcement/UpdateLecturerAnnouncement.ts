import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerAnnouncementRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateLecturerAnnouncementRoot {
    meta: MetaModel
    data: any
}
