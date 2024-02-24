import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentClassAnnouncementRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentClassAnnouncementRoot {
    meta: MetaModel
    data: any
}
