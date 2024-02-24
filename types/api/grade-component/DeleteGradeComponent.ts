import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteGradeComponentRequest {
    id: string
}
  

export interface DeleteGradeComponentRoot {
    meta: MetaModel
    data: any
}
