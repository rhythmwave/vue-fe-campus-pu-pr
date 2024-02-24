import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetClassroomListDataRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetClassroomListData[]
}

  
export interface GetClassroomListData {
    id: string
    name: string
    subject_id: string
    subject_code: string
    subject_name: string
    subject_is_mandatory: boolean
    subject_semester_package: number
    total_participant: number
    lecturers: LetcturerData[]
    subject_theory_credit: number
    subject_practicum_credit: number
    subject_field_practicum_credit: number
    is_active: boolean
    maximum_participant: number
    unapproved_study_plan: number
    total_material: number
    total_work: number
    total_discussion: number
    total_exam: number
    total_lecture_plan: number
    total_lecture_done: number
    total_event: number
    total_graded_participant: number
}

export interface LetcturerData {
    id: string
    name: string
    front_title: string
    back_degree: string
}
  