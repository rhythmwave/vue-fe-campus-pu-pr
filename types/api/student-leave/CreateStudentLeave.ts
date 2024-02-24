import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface CreateStudentLeaveRequest {
    student_id: string
    total_leave_duration_semester: number
    start_date: string
    permit_number: string
    purpose: string
    remarks: string
}

export interface CreateStudentLeaveRoot {
    meta: MetaModel
    data: any
}

