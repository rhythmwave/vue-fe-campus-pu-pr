import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateBuildingRequest {
    faculty_id: string
    major_id: string
    code: string
    name: string
}
  

export interface CreateBuildingRoot {
    meta: MetaModel
    data: any
}

