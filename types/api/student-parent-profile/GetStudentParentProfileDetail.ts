import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentParentProfileDetailRoot {
    meta: MetaModel
    data: GetStudentParentProfileDetailData
}

export interface GetStudentParentProfileDetailData {
    father_id_number: string
    father_name: string
    father_birth_date: string
    father_death_date: string
    father_final_academic_background: string
    father_occupation: string
    mother_id_number: string
    mother_name: string
    mother_birth_date: string
    mother_death_date: string
    mother_final_academic_background: string
    mother_occupation: string
    parent_religion: string
    parent_nationality: string
    parent_address: string
    father_work_address: string
    parent_province_id: number
    parent_province_name: string
    parent_regency_id: number
    parent_regency_name: string
    parent_postal_code: string
    parent_phone_number: string
    parent_email: string
    is_financially_capable: boolean
    parent_income: number
    total_dependent: number
    guardian_name: string
    guardian_birth_date: string
    guardian_death_date: string
    guardian_address: string
    guardian_province_id: number
    guardian_province_name: string
    guardian_regency_id: number
    guardian_regency_name: string
    guardian_postal_code: string
    guardian_phone_number: string
    guardian_email: string
    guardian_final_academic_background: string
    guardian_occupation: string
}
