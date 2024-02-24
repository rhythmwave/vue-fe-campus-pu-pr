import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpsertAcademicGuidanceRequest {
    semester_id: string
    lecturer_id: string
    student_ids: string[]
}
  

export interface UpsertAcademicGuidanceRoot {
    meta: MetaModel
    data: any
}

