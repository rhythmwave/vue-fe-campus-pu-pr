import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerAnnouncementRequest {
    name: string
    age: number
}
  

export interface CreateLecturerAnnouncementRoot {
    meta: MetaModel
    data: any
}

