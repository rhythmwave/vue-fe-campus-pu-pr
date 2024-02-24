import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentAnnouncementRequest {
    name: string
    age: number
}
  

export interface CreateStudentAnnouncementRoot {
    meta: MetaModel
    data: any
}

