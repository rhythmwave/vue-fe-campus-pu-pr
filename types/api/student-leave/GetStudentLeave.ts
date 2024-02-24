import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetStudentLeaveRequest {
    studyProgramId: string
    semesterId: string
    isApproved: any
}

export interface GetStudentLeaveRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentLeaveList[]
}

export interface GetStudentLeaveList{
    id: string
    nim_number: string
    name: string
    dikti_study_program_code: string
    study_program_name: string
    study_level_short_name: string
    dikti_study_program_type: string
    semester_school_year: string
    semester_type: string
    start_date: string
    total_leave_duration_semester: number,
    permit_number: string
    purpose: string
    remarks: string
    is_approved: boolean
}

