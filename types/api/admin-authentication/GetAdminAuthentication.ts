import { MetaModel } from "../meta"

export interface GetStudent {
    meta: MetaModel
    data: GetAuthenticationData
}

export interface GetAuthenticationData {
    id: string
    username: string
    authentication_type: string
    admin_id: string
    admin_name: string
    lecturer_id: string
    lecturer_name: string
    student_id: string
    student_name: string
    is_active: boolean
    suspension_remarks: string
}