import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentStudentLeaveListRequest {
    name: string
}
  

export interface GetStudentStudentLeaveListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentStudentLeaveListData[]
}

export interface GetStudentStudentLeaveListData {
    id: string
    start_date: string
    total_leave_duration_semester: number
    permit_number: string
    purpose: string
    remarks: string
    is_approved: boolean
    semester_type: string
    semester_school_year: string
}