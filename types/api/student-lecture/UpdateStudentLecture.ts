import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentLectureRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentLectureRoot {
    meta: MetaModel
    data: any
}
