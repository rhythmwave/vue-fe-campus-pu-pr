import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLessonPlanDetailRoot {
    meta: MetaModel
    data: GetLessonPlanDetailData
}

export interface GetLessonPlanDetailData {
    id: string
    meeting_order: number
    lesson: string
    english_lesson: string
}
