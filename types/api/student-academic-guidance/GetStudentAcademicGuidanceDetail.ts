import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentAcademicGuidanceDetailRoot {
    meta: MetaModel
    data: GetStudentAcademicGuidanceDetailData
}

export interface GetStudentAcademicGuidanceDetailData {
    id: string
    semester_id: string
    lecturer_id: string
    lecturer_name: string
    lecturer_front_title: string
    lecturer_back_degree: string
    decision_number: string
    decision_date: string
    total_student: number
  }
