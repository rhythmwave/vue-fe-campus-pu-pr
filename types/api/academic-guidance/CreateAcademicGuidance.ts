import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateAcademicGuidanceRequest {
    name: string
    age: number
}
  

export interface CreateAcademicGuidanceRoot {
    meta: MetaModel
    data: any
}

