import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetStudyPlanListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudyPlanListData[]
}

export interface GetStudyPlanListData {
    semester_id: string
    semester_start_year: number
    school_year: string
    semester_type: string
    total_mandatory_credit: number
    total_optional_credit: number
    grade_point: number
    student_id: string
    student_nim_number: number
    student_name: string
    study_program_id: string
    study_program_name: string
    dikti_study_program_code: string
    dikti_study_program_type: string
    study_level_short_name: string
}