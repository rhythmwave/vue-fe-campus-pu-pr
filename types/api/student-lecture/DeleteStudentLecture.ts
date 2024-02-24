import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentLectureRequest {
    id: string
}
  

export interface DeleteStudentLectureRoot {
    meta: MetaModel
    data: any
}
