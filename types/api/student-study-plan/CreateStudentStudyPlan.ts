import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentStudyPlanRequest {
    name: string
    age: number
}
  

export interface CreateStudentStudyPlanRoot {
    meta: MetaModel
    data: any
}

