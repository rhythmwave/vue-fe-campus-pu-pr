import { MetaModel } from "../meta"

export interface GetAcademicPortalLecturerGeneralProfileRoot {
    meta: MetaModel
    data: GetAcademicPortalLecturerGeneralProfileData
  }
  
  export interface GetAcademicPortalLecturerGeneralProfileData {
    id: string
    id_national_lecturer: string
    name: string
    front_title: string
    back_degree: string
    study_program_id: string
    study_program_name: string
    birth_date: string
    birth_regency_id: number
    birth_regency_name: string
    birth_country_id: number
    birth_country_name: string
    sex: string
    religion: string
    address: string
    regency_id: number
    regency_name: string
    country_id: number
    country_name: string
    postal_code: string
    phone_number: string
    fax: string
    mobile_phone_number: string
    office_phone_number: string
    academic_position: string
    employment_status: string
    status: string
  }
  