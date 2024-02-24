import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface ConvertStudentMbkmRequest {
    student_id: string
    mbkm_class_id: string
    destination_subject_ids: string[]
}
  

export interface ConvertStudentMbkmRoot {
    meta: MetaModel
    data: any
}
