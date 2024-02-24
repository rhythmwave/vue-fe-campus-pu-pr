import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerClassGradeComponentRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateLecturerClassGradeComponentRoot {
    meta: MetaModel
    data: any
}
