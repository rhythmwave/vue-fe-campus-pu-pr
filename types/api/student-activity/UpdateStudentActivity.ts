import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentActivityRequest {
    id: string
    study_program_id: string
    semester_id: string
    activity_type: string
    title: string
    location: string
    decision_number: string
    decision_date: string
    is_group_activity: boolean
    remarks: string
    participants: UpdateStudentActivityParticipant[]
    mentors: UpdateStudentActivityMentor[]
    examiners: UpdateStudentActivityExaminer[]
  }
  
  export interface UpdateStudentActivityParticipant {
    student_id: string
    student_name: string
    role: string
  }
  
  export interface UpdateStudentActivityMentor {
    lecturer_id: string
    lecturer_name: string
    activity_category: string
    sort: number
  }
  
  export interface UpdateStudentActivityExaminer {
    lecturer_id: string
    lecturer_name: string
    activity_category: string
    sort: number
  }
  

export interface UpdateStudentActivityRoot {
    meta: MetaModel
    data: any
}
