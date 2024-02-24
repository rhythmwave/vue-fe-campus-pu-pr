import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerClassGradeComponentRequest {
    name: string
    age: number
}
  

export interface CreateLecturerClassGradeComponentRoot {
    meta: MetaModel
    data: any
}

