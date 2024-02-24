import { MetaModel } from "../meta"

export interface GetAcademicPortalStudentGeneralProfileRoot {
  meta: MetaModel
  data: GetAcademicPortalStudentGeneralProfileData
}

export interface GetAcademicPortalStudentGeneralProfileData {
  id: string
  profile_photo_path: string
  profile_photo_path_type: string
  profile_photo_url: string
  name: string
  sex: string
  birth_province_id: number
  birth_province_name: string
  birth_regency_id: number
  birth_regency_name: string
  birth_date: string
  blood_type: string
  height: number
  weight: number
  is_color_blind: boolean
  use_glasses: boolean
  has_complete_teeth: boolean
  study_program_id: string
  study_program_name: string
  dikti_study_program_type: string
  study_level_short_name: string
  admittance_semester: string
  student_force: number
  admittance_test_number: string
  college_entrance_type: string
  admittance_date: string
  admittance_status: string
  npwp_number: string
  nisn_number: string
  religion: string
  marital_status: string
  nationality: string
  province_id: number
  province_name: string
  regency_id: number
  regency_name: string
  district_id: number
  district_name: string
  village_id: number
  village_name: string
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
