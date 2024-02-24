import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLessonPlanRequest {
    id: string
    subject_id: string
    meeting_order: number
    lesson: string
    english_lesson: string
}
  

export interface UpdateLessonPlanRoot {
    meta: MetaModel
    data: any
}
