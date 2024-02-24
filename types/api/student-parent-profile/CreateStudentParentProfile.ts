import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentParentProfileRequest {
    name: string
    age: number
}
  

export interface CreateStudentParentProfileRoot {
    meta: MetaModel
    data: any
}

