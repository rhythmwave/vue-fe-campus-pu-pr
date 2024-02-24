import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentFileSharingRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentFileSharingRoot {
    meta: MetaModel
    data: any
}
