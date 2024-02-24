import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetStudentSubjectGradeListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentSubjectGradeListData[]
}

export interface GetStudentSubjectGradeListData {
    subject_id: string
    subject_code: string
    subject_name: string
    grade_semester_id: string
    grade_semester_school_year: string
    grade_semester_type: string
    grade_point: number
    grade_code: string
    subject_is_mandatory: boolean
    semester_package: number
    subject_total_credit: number
    subject_type: string
}