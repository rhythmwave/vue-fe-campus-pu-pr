import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetStudentPaymentLogRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentPaymentLogData[]
}

export interface GetStudentPaymentLogData {
    semester_id: string
    semester_type: string
    semester_start_year: number
    semester_school_year: string
    created_at: string
}