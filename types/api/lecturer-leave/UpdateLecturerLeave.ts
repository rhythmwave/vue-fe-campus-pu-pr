import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerLeaveRequest {
    id: string
    lecturer_id: string
    semester_id: string
    start_date: string
    permit_number: string
    purpose: string
    remarks: string
    file_url: string
    file_path: string
    file_path_type: string
}
  

export interface UpdateLecturerLeaveRoot {
    meta: MetaModel
    data: any
}
