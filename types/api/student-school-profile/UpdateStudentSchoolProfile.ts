import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentSchoolProfileRequest {
    school_enrollment_year: string
    school_graduation_year: string
    school_enrollment_class: string
    school_major: string
    school_type: string
    school_name: string
    school_province_id: number
    school_address: string
    school_certificate_number: string
    school_certificate_date: string
    school_status: string
    school_accreditation: string
    school_final_exam_score: number
    school_mathematics_final_exam_score: number
    school_indonesian_final_exam_score: number
    school_english_final_exam_score: number
    school_mathematics_report_score: number
    school_indonesian_report_score: number
    school_english_report_score: number
    pre_high_school_histories: UpdateStudentSchoolProfilePreHighSchoolHistory[]
  }
  
  export interface UpdateStudentSchoolProfilePreHighSchoolHistory {
    level: string
    name: string
    graduation_year: string
  }
  

export interface UpdateStudentSchoolProfileRoot {
    meta: MetaModel
    data: any
}
