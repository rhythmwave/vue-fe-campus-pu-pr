import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetOfferedClassRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetOfferedClassData[]
}

export interface GetOfferedClassData{
    semester_package: number
    classes: GetOfferedClassClassData[]
}

export interface GetOfferedClassClassData{
    id: string
    name: string
    subject_code: string
    subject_name: string
    subject_is_mandatory: boolean
    subject_theory_credit: number
    subject_practicum_credit: number
    subject_field_practicum_credit: number
    maximum_participant: number
    subject_total_lesson_plan: number
    lecturers: GetOfferedClassLecturerData[]
}

export interface GetOfferedClassLecturerData {
    name: string
    front_title: string
    back_degree: string
}