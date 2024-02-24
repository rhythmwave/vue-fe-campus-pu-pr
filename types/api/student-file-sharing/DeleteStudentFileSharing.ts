import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentFileSharingRequest {
    id: string
}
  

export interface DeleteStudentFileSharingRoot {
    meta: MetaModel
    data: any
}
