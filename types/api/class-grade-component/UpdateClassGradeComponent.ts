import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateClassGradeComponentRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateClassGradeComponentRoot {
    meta: MetaModel
    data: any
}
