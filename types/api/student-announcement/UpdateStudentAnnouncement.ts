import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentAnnouncementRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentAnnouncementRoot {
    meta: MetaModel
    data: any
}
