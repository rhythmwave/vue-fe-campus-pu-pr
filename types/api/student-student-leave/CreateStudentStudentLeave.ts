import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentStudentLeaveRequest {
    total_leave_duration_semester: number
    start_date: string
    purpose: string
    remarks: string
}


export interface CreateStudentStudentLeaveRoot {
    meta: MetaModel
    data: any
}

