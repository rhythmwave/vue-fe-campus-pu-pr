import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentStudyPlanRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentStudyPlanRoot {
    meta: MetaModel
    data: any
}
