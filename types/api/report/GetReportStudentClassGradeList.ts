import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetReportStudentClassGradeListRequest {
    name: string
}


export interface GetReportStudentClassGradeListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetReportStudentClassGradeListData[]
}

export interface GetReportStudentClassGradeListData {
    subject_id: string
    subject_name: string
    grades: GetReportStudentClassGradeListGrade[]
}

export interface GetReportStudentClassGradeListGrade {
    grade_code: string
    total: number
}