import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentTranscriptRoot {
    meta: MetaModel
    data: GetStudentTranscriptData
}

export interface GetStudentTranscriptData {
    nim_number: string
    name: string
    birth_regency_name: string
    birth_date: string
    graduation_date: string
    diploma_number: string
    study_program_name: string
    study_level_name: string
    study_level_short_name: string
    total_credit: number
    gpa: string
    graduation_predicate: string
    theory_credit: number
    practicum_credit: number
    thesis_title: string
    thesis_english_title: string
    semesters: GetStudentTranscriptSemester[]
  }
  
  export interface GetStudentTranscriptSemester {
    semester_package: number
    subjects: GetStudentTranscriptSubject[]
  }
  
  export interface GetStudentTranscriptSubject {
    subject_code: string
    subject_name: string
    subject_english_name: string
    theory_credit: number
    practicum_credit: number
    grade_code: string
  }