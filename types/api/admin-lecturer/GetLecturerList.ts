import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

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
}

export interface GetLecturerListPortalAcademic {
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
}

export interface GetLecturerDetailData {
  id: string
  id_national_lecturer: string
  name: string
  front_title: string
  back_degree: string
  study_program_id: string
  study_program_name: string
  id_number: string
  birth_date: string
  birth_regency_id: string
  birth_regency_name: string
  birth_country_id: string
  birth_country_name: string
  id_employee: string
  stambuk: string
  sex: string
  blood_type: string
  religion: string
  marital_status: string
  address: string
  regency_id: string
  regency_name: string
  country_id: string
  country_name: string
  postal_code: string
  phone_number: string
  fax: string
  mobile_phone_number: string
  office_phone_number: string
  employee_type: string
  employee_status: string
  sk_cpns_number: string
  sk_cpns_date: string
  tmt_cpns_date: string
  cpns_category: string
  cpns_duration_month: string
  pre_position_date: string
  sk_pns_number: string
  sk_pns_date: string
  tmt_pns_date: string
  pns_category: string
  pns_oath_date: string
  join_date: string
  end_date: string
  taspen_number: string
  former_instance: string
  remarks: string
  lecturer_number: string
  academic_position: string
  employment_status: string
  expertise: string
  highest_degree: string
  instance_code: string
  teaching_certificate_number: string
  teaching_permit_number: string
  status: string
  resign_semester: string
}
  