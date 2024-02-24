import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentLectureRequest {
    name: string
    age: number
}
  

export interface CreateStudentLectureRoot {
    meta: MetaModel
    data: any
}

