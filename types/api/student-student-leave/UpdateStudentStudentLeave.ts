import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentStudentLeaveRequest {
    id: string
    purpose: string
    remarks: string
}
  

export interface UpdateStudentStudentLeaveRoot {
    meta: MetaModel
    data: any
}
