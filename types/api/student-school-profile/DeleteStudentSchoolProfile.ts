import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentSchoolProfileRequest {
    id: string
}
  

export interface DeleteStudentSchoolProfileRoot {
    meta: MetaModel
    data: any
}
