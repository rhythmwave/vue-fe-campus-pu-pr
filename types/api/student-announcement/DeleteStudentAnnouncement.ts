import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentAnnouncementRequest {
    id: string
}
  

export interface DeleteStudentAnnouncementRoot {
    meta: MetaModel
    data: any
}
