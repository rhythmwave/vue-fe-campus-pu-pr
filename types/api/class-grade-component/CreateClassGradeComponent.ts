import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateClassGradeComponentRequest {
    name: string
    age: number
}
  

export interface CreateClassGradeComponentRoot {
    meta: MetaModel
    data: any
}

