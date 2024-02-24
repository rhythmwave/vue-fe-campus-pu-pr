import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentActivityRequest {
    study_program_id: string
    semester_id: string
    activity_type: string
    title: string
    location: string
    decision_number: string
    decision_date: string
    is_group_activity: boolean
    remarks: string
    participants: CreateStudentActivityParticipant[]
    mentors: CreateStudentActivityMentor[]
    examiners: CreateStudentActivityExaminer[]
  }
  
  export interface CreateStudentActivityParticipant {
    student_id: string
    student_name: string
    role: string
  }
  
  export interface CreateStudentActivityMentor {
    lecturer_id: string
    lecturer_name: string
    activity_category: string
    sort: number
  }
  
  export interface CreateStudentActivityExaminer {
    lecturer_id: string
    lecturer_name: string
    activity_category: string
    sort: number
  }

export interface CreateStudentActivityRoot {
    meta: MetaModel
    data: any
}

