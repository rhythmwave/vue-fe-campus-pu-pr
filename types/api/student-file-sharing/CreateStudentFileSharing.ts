import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentFileSharingRequest {
    name: string
    age: number
}
  

export interface CreateStudentFileSharingRoot {
    meta: MetaModel
    data: any
}

