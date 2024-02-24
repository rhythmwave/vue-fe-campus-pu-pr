import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteLecturerClassMaterialRequest {
    id: string
}
  

export interface DeleteLecturerClassMaterialRoot {
    meta: MetaModel
    data: any
}
