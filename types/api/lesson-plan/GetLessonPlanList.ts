import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLessonPlanListRequest {
    name: string
}
  

export interface GetLessonPlanListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLessonPlanListData[]
}

export interface GetLessonPlanListData {
    id: string
    meeting_order: number
    lesson: string
    english_lesson: string
}