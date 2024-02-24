import { MetaModel } from "../meta"

export interface UpdateAdminStudyProgramRequest {
    id: string
    dikti_study_program_id: string
    name: string
    english_name: string
    short_name: string
    english_short_name: string
    administrative_unit: string
    major_id: string
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
    operator_name: string
    operator_phone_number: string
    minimum_graduation_credit: number
    age: number
  }
  
export interface UpdateAdminStudyProgramRoot {
    meta: MetaModel
    data: any
  }
