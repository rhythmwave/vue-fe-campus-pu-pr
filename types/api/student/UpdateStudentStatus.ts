import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentStatusRequest {
    student_ids: string[]
    status: string
    status_date: string
    status_reference_number: string
    status_purpose: string
    status_remarks: string
}
  

export interface UpdateStudentStatusRoot {
    meta: MetaModel
    data: any
}
