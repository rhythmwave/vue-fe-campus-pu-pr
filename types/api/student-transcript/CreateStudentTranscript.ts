import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentTranscriptRequest {
    name: string
    age: number
}
  

export interface CreateStudentTranscriptRoot {
    meta: MetaModel
    data: any
}

