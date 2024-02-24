import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteAcademicGuidanceRequest {
    id: string
}
  

export interface DeleteAcademicGuidanceRoot {
    meta: MetaModel
    data: any
}
