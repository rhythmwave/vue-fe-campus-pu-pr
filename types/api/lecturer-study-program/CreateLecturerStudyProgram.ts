import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerStudyProgramRequest {
    name: string
    age: number
}
  

export interface CreateLecturerStudyProgramRoot {
    meta: MetaModel
    data: any
}

