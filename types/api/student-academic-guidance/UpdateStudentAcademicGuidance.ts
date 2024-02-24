import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentAcademicGuidanceRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentAcademicGuidanceRoot {
    meta: MetaModel
    data: any
}
