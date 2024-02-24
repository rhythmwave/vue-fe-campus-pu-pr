import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerLeaveRequest {
    lecturer_id: string
    semester_id: string
    start_date: string
    permit_number: string
    purpose: string
    remarks: string
    file_path: string
    file_path_type: string
}
  

export interface CreateLecturerLeaveRoot {
    meta: MetaModel
    data: any
}

