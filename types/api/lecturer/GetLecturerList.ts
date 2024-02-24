import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerListRequest {
    name: string
}


export interface GetLecturerListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerListData[]
}

export interface GetLecturerListData {
    id: string
    name: string
    phone_number: string
    mobile_phone_number: string
    office_phone_number: string
    id_national_lecturer: string
    front_title: string
    back_degree: string
    dikti_study_program_code: string
    study_program_name: string
    employment_status: string
    status: string
    authentication_id: string
    authentication_is_active: boolean
    authentication_suspension_remarks: string
    academic_guidance_total_student: number
    academic_guidance_id: string
    academic_guidance_decision_number: string
    academic_guidance_decision_date: string
}