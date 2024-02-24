import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLessonPlanRequest {
    subject_id: string
    meeting_order: number
    lesson: string
    english_lesson: string
}
  

export interface CreateLessonPlanRoot {
    meta: MetaModel
    data: any
}

