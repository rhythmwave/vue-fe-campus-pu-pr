import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentAcademicGuidanceRequest {
    id: string
}
  

export interface DeleteStudentAcademicGuidanceRoot {
    meta: MetaModel
    data: any
}
