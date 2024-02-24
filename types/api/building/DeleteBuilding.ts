import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteBuildingRequest {
    id: string
}
  

export interface DeleteBuildingRoot {
    meta: MetaModel
    data: any
}
