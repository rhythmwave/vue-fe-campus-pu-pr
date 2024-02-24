import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteCuriculumRequest {
    id: string
}
  

export interface DeleteCuriculumRoot {
    meta: MetaModel
    data: any
}
