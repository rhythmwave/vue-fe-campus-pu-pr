import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentSchoolProfileRequest {
    name: string
    age: number
}
  

export interface CreateStudentSchoolProfileRoot {
    meta: MetaModel
    data: any
}

