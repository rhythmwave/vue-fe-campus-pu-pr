import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentAcademicGuidanceRequest {
    name: string
    age: number
}
  

export interface CreateStudentAcademicGuidanceRoot {
    meta: MetaModel
    data: any
}

