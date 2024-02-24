import { MetaModel } from "../meta"

export interface GetAdminStudyProgramDetailRoot {
    meta: MetaModel
    data: GetAdminStudyProgramDetailData
  }
  
  export interface GetAdminStudyProgramDetailData {
    id: string
    dikti_study_program_id: string
    dikti_study_program_code: string
    dikti_study_program_name: string
    dikti_study_program_type: string
    study_level_short_name: string
    study_level_name: string
    name: string
    english_name: string
    short_name: string
    english_short_name: string
    administrative_unit: string
    faculty_id: string
    faculty_name: string
    major_id: string
    major_name: string
    address: string
    phone_number: string
    fax: string
    email: string
    website: string
    contact_person: string
    curiculum_review_frequency: string
    curiculum_review_method: string
    establishment_date: string
    is_active: boolean
    start_semester: string
    operational_permit_number: string
    operational_permit_date: string
    operational_permit_due_date: string
    head_lecturer_id: string
    head_lecturer_name: string
    head_lecturer_mobile_phone_number: string
    operator_name: string
    operator_phone_number: string
    minimum_graduation_credit: number
  }
  