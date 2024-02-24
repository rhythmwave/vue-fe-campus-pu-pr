import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLessonPlanRequest {
    id: string
}
  

export interface DeleteLessonPlanRoot {
    meta: MetaModel
    data: any
}
