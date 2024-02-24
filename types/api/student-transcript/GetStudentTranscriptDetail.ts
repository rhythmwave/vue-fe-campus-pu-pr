import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentTranscriptDetailRoot {
    meta: MetaModel
    data: GetStudentTranscriptDetailData
}

export interface GetStudentTranscriptDetailData {
    id: string
    name: string
    nim_number: number
    study_program_name: string
    total_credit: number
    gpa: number
    subjects: GetStudentTranscriptDetailSubject[]
  }
  
  export interface GetStudentTranscriptDetailSubject {
    semester_type: string
    semester_start_year: number
    semester_school_year: string
    subject_code: string
    subject_name: string
    subject_theory_credit: number
    subject_practicum_credit: number
    subject_field_practicum_credit: number
    grade_point: number
    grade_code: string
  }
  
