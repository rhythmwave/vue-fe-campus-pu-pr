import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLecturerLeaveRequest {
    id: string
}
  

export interface DeleteLecturerLeaveRoot {
    meta: MetaModel
    data: any
}
