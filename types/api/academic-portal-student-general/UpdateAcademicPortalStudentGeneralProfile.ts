import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateAcademicPortalStudentGeneralProfileRequest {
    profile_photo_path: string
    profile_photo_path_type: string
    sex: string
    birth_regency_id: number
    blood_type: string
    height: number
    weight: number
    is_color_blind: boolean
    use_glasses: boolean
    has_complete_teeth: boolean
    id_number: string
    npwp_number: string
    nisn_number: string
    religion: string
    marital_status: string
    nationality: string
    village_id: number
    rt: string
    rw: string
    postal_code: string
    address: string
    phone_number: string
    mobile_phone_number: string
    email: string
    transportation_mean: string
    is_kps_recipient: boolean
    fund_source: string
    is_scholarship_grantee: boolean
    total_brother: number
    total_sister: number
    work_type: string
    work_place: string
    work_address: string
    assurance_number: string
    hobby: string
}
  

export interface UpdateAcademicPortalStudentGeneralProfileRoot {
    meta: MetaModel
    data: any
}
