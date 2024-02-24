import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface UpdateStudentLeaveRequest {
    id: string
    permit_number: string
    purpose: string
    remarks: string
}

export interface UpdateStudentLeaveRoot {
    meta: MetaModel
    data: any
}

