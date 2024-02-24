import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerStudyProgramRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateLecturerStudyProgramRoot {
    meta: MetaModel
    data: any
}
