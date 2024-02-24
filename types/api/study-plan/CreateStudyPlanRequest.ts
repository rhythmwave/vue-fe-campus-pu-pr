import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudyPlanRequest {
    semester_id: string
    student_ids: string[]
    class_ids: string[]
}

export interface CreateStudyPlanRoot {
    meta: MetaModel
    data: any
}