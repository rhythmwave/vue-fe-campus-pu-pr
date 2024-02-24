import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentStudyPlanDetailRoot {
  meta: MetaModel
  data: GetStudentStudyPlanDetailData
}

export interface GetStudentStudyPlanDetailData {
  study_plan_input_start_date: string
  study_plan_input_end_date: string
  id: string
  is_approved: boolean
  student_id: string
  student_nim_number: number
  student_name: string
  study_program_id: string
  study_program_name: string
  semester_id: string
  semester_school_year: string
  semester_type: string
  maximum_credit: number
  academic_guidance_lecturer_id: string
  academic_guidance_lecturer_name: string
  academic_guidance_lecturer_front_title: string
  academic_guidance_lecturer_back_degree: string
  classes: GetStudentStudyPlanDetailClass[]
  is_submitted: boolean
  total_mandatory_credit: number
  total_optional_credit: number
  grade_point: number
  gpa: number
}

export interface GetStudentStudyPlanDetailClass {
  id: string
  name: string
  subject_id: string
  subject_name: string
  subject_code: string
  subject_theory_credit: number
  subject_field_practicum_credit: number
  subject_practicum_credit: number
  schedules: GetStudentStudyPlanDetailSchedule[]
  total_lecture_done: number
  total_attendance: number
  active_lecture_id: string
  grade_point: number
  grade_code: string
  is_mandatory: string
}

export interface GetStudentStudyPlanDetailSchedule {
  day_of_week: number
  start_time: number
  end_time: number
  room_id: string
  room_name: string
}