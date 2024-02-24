import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentClassAnnouncementRequest {
    name: string
    age: number
}
  

export interface CreateStudentClassAnnouncementRoot {
    meta: MetaModel
    data: any
}

