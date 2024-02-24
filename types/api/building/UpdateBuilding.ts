import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateBuildingRequest {
    id: string
    faculty_id: string
    major_id: string
    code: string
    name: string
}
  

export interface UpdateBuildingRoot {
    meta: MetaModel
    data: any
}
