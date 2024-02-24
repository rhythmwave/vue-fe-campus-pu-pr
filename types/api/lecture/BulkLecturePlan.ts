import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface BulkLecturePlanRequest {
    class_id: string
    lecture_plan_dates: string[]
}

export interface BulkLecturePlanRoot {
    meta: MetaModel
    data: any
}

