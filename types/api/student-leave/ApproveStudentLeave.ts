import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface ApproveStudentLeaveRequest {
    id: string
    is_approved: boolean
}

export interface ApproveStudentLeaveRoot {
    meta: MetaModel
    data: any
}


